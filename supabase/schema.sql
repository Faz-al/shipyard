create extension if not exists pgcrypto;
create type public.user_role as enum ('developer','tester','admin');
create type public.account_status as enum ('active','suspended');
create type public.project_status as enum ('draft','pending_payment','recruiting','active','completed','cancelled');
create type public.payment_status as enum ('unpaid','pending','paid','failed','refunded');
create type public.assignment_status as enum ('active','completed','removed');
create type public.review_status as enum ('pending','approved','rejected');

create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 email text not null,
 full_name text not null default '',
 role public.user_role not null default 'developer',
 status public.account_status not null default 'active',
 device_model text,
 android_version text,
 country text default 'India',
 reliability_score integer not null default 100 check (reliability_score between 0 and 100),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.plans (
 id uuid primary key default gen_random_uuid(), name text unique not null, price_inr integer not null,
 tester_count integer not null, duration_days integer not null default 14, reward_inr integer not null default 50,
 active boolean not null default true, sort_order integer not null default 0, created_at timestamptz not null default now()
);
create table public.projects (
 id uuid primary key default gen_random_uuid(), developer_id uuid not null references public.profiles(id) on delete cascade,
 plan_id uuid not null references public.plans(id), app_name text not null, package_name text not null,
 description text not null, platform text not null default 'Android', google_group_url text not null,
 android_opt_in_url text not null, web_opt_in_url text not null, status public.project_status not null default 'pending_payment',
 payment_status public.payment_status not null default 'unpaid', current_day integer not null default 0,
 duration_days integer, started_at timestamptz, completed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index projects_active_package_idx on public.projects(package_name) where status not in ('completed','cancelled');
create table public.assignments (
 id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade,
 tester_id uuid not null references public.profiles(id) on delete cascade, status public.assignment_status not null default 'active',
 reward_inr integer not null default 0, created_at timestamptz not null default now(), completed_at timestamptz,
 unique(project_id,tester_id)
);
create table public.checkins (
 id uuid primary key default gen_random_uuid(), assignment_id uuid not null references public.assignments(id) on delete cascade,
 project_id uuid not null references public.projects(id) on delete cascade, tester_id uuid not null references public.profiles(id) on delete cascade,
 day_number integer not null check(day_number between 1 and 60), notes text not null, proof_path text,
 status public.review_status not null default 'pending', reviewer_notes text, created_at timestamptz not null default now(), reviewed_at timestamptz,
 unique(assignment_id,day_number)
);
create table public.bug_reports (
 id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade,
 assignment_id uuid references public.assignments(id) on delete set null, reporter_id uuid not null references public.profiles(id),
 title text not null, severity text not null check(severity in ('low','medium','high','critical')), steps text not null,
 expected text, actual text, status text not null default 'open', created_at timestamptz not null default now()
);
create table public.feedback (
 id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade,
 assignment_id uuid not null references public.assignments(id) on delete cascade, tester_id uuid not null references public.profiles(id),
 rating integer not null check(rating between 1 and 5), positives text, improvements text, created_at timestamptz not null default now(), unique(assignment_id)
);
create table public.payments (
 id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade,
 developer_id uuid not null references public.profiles(id), provider text not null default 'razorpay', amount_inr integer not null,
 currency text not null default 'INR', provider_order_id text unique, provider_payment_id text unique,
 status public.payment_status not null default 'pending', raw_response jsonb, created_at timestamptz not null default now(), paid_at timestamptz
);
create table public.wallet_transactions (
 id uuid primary key default gen_random_uuid(), tester_id uuid not null references public.profiles(id), assignment_id uuid references public.assignments(id),
 amount_inr integer not null, type text not null check(type in ('credit','debit','payout')), status text not null default 'pending', created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from profiles where id=auth.uid() and role='admin' and status='active')$$;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$begin insert into public.profiles(id,email,full_name,role) values(new.id,new.email,coalesce(new.raw_user_meta_data->>'full_name',''),case when new.raw_user_meta_data->>'role'='tester' then 'tester'::user_role else 'developer'::user_role end);return new;end$$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create or replace function public.available_projects_for_tester() returns table(id uuid,app_name text,description text,platform text,duration_days integer,slots_left bigint,reward_inr integer) language sql security definer set search_path=public as $$select p.id,p.app_name,p.description,p.platform,coalesce(p.duration_days,pl.duration_days),pl.tester_count-count(a.id),pl.reward_inr from projects p join plans pl on pl.id=p.plan_id left join assignments a on a.project_id=p.id where p.status='recruiting' and p.payment_status='paid' and not exists(select 1 from assignments x where x.project_id=p.id and x.tester_id=auth.uid()) group by p.id,pl.id having count(a.id)<pl.tester_count$$;
create or replace function public.accept_testing_assignment(p_project_id uuid) returns uuid language plpgsql security definer set search_path=public as $$declare v_id uuid;v_reward int;v_limit int;v_count int;begin if not exists(select 1 from profiles where id=auth.uid() and role='tester' and status='active') then raise exception 'Only active testers may accept assignments';end if;select pl.reward_inr,pl.tester_count into v_reward,v_limit from projects p join plans pl on pl.id=p.plan_id where p.id=p_project_id and p.status='recruiting' and p.payment_status='paid' for update;if not found then raise exception 'Project is not available';end if;select count(*) into v_count from assignments where project_id=p_project_id;if v_count>=v_limit then raise exception 'No testing slots remain';end if;insert into assignments(project_id,tester_id,reward_inr) values(p_project_id,auth.uid(),v_reward) returning id into v_id;return v_id;end$$;
create or replace function public.admin_dashboard_stats() returns jsonb language sql stable security definer set search_path=public as $$select case when public.is_admin() then jsonb_build_object('projects',(select count(*) from projects),'testers',(select count(*) from profiles where role='tester'),'pending_checkins',(select count(*) from checkins where status='pending'),'revenue_inr',coalesce((select sum(amount_inr) from payments where status='paid'),0)) else '{}'::jsonb end$$;

alter table profiles enable row level security;alter table plans enable row level security;alter table projects enable row level security;alter table assignments enable row level security;alter table checkins enable row level security;alter table bug_reports enable row level security;alter table feedback enable row level security;alter table payments enable row level security;alter table wallet_transactions enable row level security;
create policy "profiles own read" on profiles for select using(id=auth.uid() or public.is_admin());
create policy "profiles own update" on profiles for update using(id=auth.uid()) with check(id=auth.uid() and role=(select role from profiles where id=auth.uid()));
create policy "plans public read" on plans for select using(active or public.is_admin());
create policy "projects developer read" on projects for select using(developer_id=auth.uid() or public.is_admin() or exists(select 1 from assignments a where a.project_id=id and a.tester_id=auth.uid()));
create policy "projects developer insert" on projects for insert with check(developer_id=auth.uid() and exists(select 1 from profiles where id=auth.uid() and role='developer'));
create policy "projects developer update" on projects for update using(developer_id=auth.uid() or public.is_admin());
create policy "assignments visible" on assignments for select using(tester_id=auth.uid() or public.is_admin() or exists(select 1 from projects p where p.id=project_id and p.developer_id=auth.uid()));
create policy "assignments admin insert" on assignments for insert with check(public.is_admin());
create policy "checkins visible" on checkins for select using(tester_id=auth.uid() or public.is_admin() or exists(select 1 from projects p where p.id=project_id and p.developer_id=auth.uid()));
create policy "tester checkin insert" on checkins for insert with check(tester_id=auth.uid() and exists(select 1 from assignments a where a.id=assignment_id and a.tester_id=auth.uid() and a.status='active'));
create policy "admin checkin review" on checkins for update using(public.is_admin());
create policy "bugs visible" on bug_reports for select using(reporter_id=auth.uid() or public.is_admin() or exists(select 1 from projects p where p.id=project_id and p.developer_id=auth.uid()));
create policy "tester bug insert" on bug_reports for insert with check(reporter_id=auth.uid());
create policy "feedback visible" on feedback for select using(tester_id=auth.uid() or public.is_admin() or exists(select 1 from projects p where p.id=project_id and p.developer_id=auth.uid()));
create policy "tester feedback insert" on feedback for insert with check(tester_id=auth.uid());
create policy "payments developer read" on payments for select using(developer_id=auth.uid() or public.is_admin());
create policy "wallet owner read" on wallet_transactions for select using(tester_id=auth.uid() or public.is_admin());
insert into plans(name,price_inr,tester_count,duration_days,reward_inr,sort_order) values ('Launch',699,12,14,25,1),('Scale',1299,20,14,40,2),('Studio',4999,50,30,75,3) on conflict(name) do nothing;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('testing-proofs','testing-proofs',false,5242880,array['image/png','image/jpeg','image/webp']) on conflict(id) do nothing;
create policy "tester uploads own proof" on storage.objects for insert to authenticated with check(bucket_id='testing-proofs' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "proof owner or admin read" on storage.objects for select to authenticated using(bucket_id='testing-proofs' and ((storage.foldername(name))[1]=auth.uid()::text or public.is_admin()));
