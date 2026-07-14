import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  LoaderCircle,
  Lock,
  Save,
} from "lucide-react";

import {
  Card,
  DashboardLayout,
  PageHead,
} from "../components/UI";

import {
  developerUpdateProject,
  getPendingProjectCorrection,
  getProject,
  getProjectEditMode,
  listPlans,
  requestProjectCorrection,
} from "../lib/api";

function getInitialForm(project) {
  return {
    app_name:
      project?.app_name || "",

    package_name:
      project?.package_name || "",

    customer_phone:
      project?.customer_phone || "",

    description:
      project?.description || "",

    google_group_url:
      project?.google_group_url || "",

    android_opt_in_url:
      project?.android_opt_in_url || "",

    web_opt_in_url:
      project?.web_opt_in_url || "",

    plan_id:
      project?.plan_id || "",
  };
}

function normaliseValue(value) {
  return String(value ?? "").trim();
}

function getChangedFields({
  original,
  form,
  allowedFields,
}) {
  const changes = {};

  allowedFields.forEach((field) => {
    const currentValue =
      normaliseValue(form[field]);

    const originalValue =
      normaliseValue(
        original[field]
      );

    if (
      currentValue !== originalValue
    ) {
      changes[field] =
        currentValue;
    }
  });

  return changes;
}

function AppLogoPreview({
  preview,
  project,
}) {
  if (preview) {
    return (
      <img
        src={preview}
        alt="Selected app logo preview"
      />
    );
  }

  if (project?.app_logo_url) {
    return (
      <img
        src={project.app_logo_url}
        alt={`${project.app_name || "App"} logo`}
      />
    );
  }

  return (
    <span>
      {project?.app_name?.[0]
        ?.toUpperCase() ||
        "A"}
    </span>
  );
}

export default function EditProject() {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const [
    project,
    setProject,
  ] = useState(null);

  const [
    plans,
    setPlans,
  ] = useState([]);

  const [
    form,
    setForm,
  ] = useState(
    getInitialForm(null)
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    reason,
    setReason,
  ] = useState("");

  const [
    appLogoFile,
    setAppLogoFile,
  ] = useState(null);

  const [
    appLogoPreview,
    setAppLogoPreview,
  ] = useState("");

  const [
    removeCurrentLogo,
    setRemoveCurrentLogo,
  ] = useState(false);

  const [
    pendingCorrection,
    setPendingCorrection,
  ] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadPage() {
      try {
        setLoading(true);
        setError("");

        const [
          projectData,
          plansData,
          pendingData,
        ] = await Promise.all([
          getProject(id),
          listPlans(),
          getPendingProjectCorrection(
            id
          ),
        ]);

        if (!active) {
          return;
        }

        setProject(
          projectData
        );

        setForm(
          getInitialForm(
            projectData
          )
        );

        setPlans(
          Array.isArray(plansData)
            ? plansData
            : []
        );

        setPendingCorrection(
          pendingData
        );
      } catch (err) {
        if (active) {
          setError(
            err.message ||
              "Could not load this project."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      active = false;
    };
  }, [id]);

  const editMode =
    useMemo(
      () =>
        getProjectEditMode(
          project
        ),
      [project]
    );

  const allowedFields =
    useMemo(() => {
      if (
        editMode === "full"
      ) {
        return [
          "app_name",
          "package_name",
          "customer_phone",
          "description",
          "google_group_url",
          "android_opt_in_url",
          "web_opt_in_url",
          "plan_id",
        ];
      }

      if (
        editMode === "limited"
      ) {
        return [
          "customer_phone",
          "description",
          "google_group_url",
          "android_opt_in_url",
          "web_opt_in_url",
        ];
      }

      if (
        editMode ===
        "correction"
      ) {
        return [
          "app_name",
          "package_name",
          "customer_phone",
          "description",
          "google_group_url",
          "android_opt_in_url",
          "web_opt_in_url",
        ];
      }

      return [];
    }, [editMode]);

  const isFieldEditable = (
    field
  ) =>
    allowedFields.includes(
      field
    );

  const updateField = (
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const selectLogo = (
    event
  ) => {
    const file =
      event.target.files?.[0] ||
      null;

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      event.target.value = "";

      setError(
        "Please upload a PNG, JPG or WebP app logo."
      );

      return;
    }

    if (
      file.size >
      2 * 1024 * 1024
    ) {
      event.target.value = "";

      setError(
        "The app logo must be smaller than 2 MB."
      );

      return;
    }

    setError("");
    setAppLogoFile(file);
    setRemoveCurrentLogo(false);

    const reader =
      new FileReader();

    reader.onload = () => {
      setAppLogoPreview(
        typeof reader.result ===
          "string"
          ? reader.result
          : ""
      );
    };

    reader.readAsDataURL(
      file
    );
  };

  const clearSelectedLogo = () => {
    setAppLogoFile(null);
    setAppLogoPreview("");
  };

  const submit = async (
    event
  ) => {
    event.preventDefault();

    if (!project) {
      return;
    }

    if (
      pendingCorrection &&
      editMode === "correction"
    ) {
      setError(
        "A correction request is already pending for this project."
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const changes =
        getChangedFields({
          original:
            getInitialForm(
              project
            ),

          form,

          allowedFields,
        });

      if (
        editMode === "full" ||
        editMode === "limited"
      ) {
        await developerUpdateProject({
          projectId:
            project.id,

          changes,

          appLogoFile,

          removeCurrentLogo,

          currentLogoPath:
            project.app_logo_path,
        });

        setMessage(
          "Project updated successfully."
        );

        navigate(
          `/projects/${project.id}`,
          {
            replace: true,
          }
        );

        return;
      }

      if (
        editMode ===
        "correction"
      ) {
        await requestProjectCorrection({
          projectId:
            project.id,

          changes,

          reason,

          appLogoFile,
        });

        setMessage(
          "Correction request submitted for admin review."
        );

        navigate(
          `/projects/${project.id}`,
          {
            replace: true,
          }
        );

        return;
      }

      throw new Error(
        "This project cannot be edited at its current stage."
      );
    } catch (err) {
      setError(
        err.message ||
          "The project could not be updated."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="full-loader">
          Loading project editor…
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <PageHead
          eyebrow="Project editor"
          title="Project not found"
          description="This project is unavailable."
        />

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}
      </DashboardLayout>
    );
  }

  if (
    editMode === "locked"
  ) {
    return (
      <DashboardLayout>
        <PageHead
          eyebrow="Project editor"
          title="Project editing locked"
          description="This project cannot be edited at its current stage."
          action={
            <Link
              className="button secondary"
              to={`/projects/${project.id}`}
            >
              <ArrowLeft size={17} />
              Back to project
            </Link>
          }
        />

        <Card>
          <div className="project-edit-locked">
            <Lock size={24} />

            <div>
              <strong>
                Release details are locked
              </strong>

              <p>
                The project stage does not permit direct edits or correction requests.
              </p>
            </div>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  const isCorrection =
    editMode ===
    "correction";

  return (
    <DashboardLayout>
      <PageHead
        eyebrow={
          isCorrection
            ? "Correction request"
            : "Project editor"
        }
        title={
          isCorrection
            ? "Request a project correction"
            : "Edit project"
        }
        description={
          isCorrection
            ? "Testers may already have joined. Requested changes require admin approval."
            : "Update the project details allowed at this release stage."
        }
        action={
          <Link
            className="button secondary"
            to={`/projects/${project.id}`}
          >
            <ArrowLeft size={17} />
            Back to project
          </Link>
        }
      />

      {message && (
        <div className="alert success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      {pendingCorrection &&
        isCorrection && (
          <div className="alert warning">
            A correction request is already pending. Wait for admin review before submitting another request.
          </div>
        )}

      <form
        className="project-edit-form"
        onSubmit={submit}
      >
        <Card>
          <div className="card-head">
            <div>
              <h2>
                App identity
              </h2>

              <p>
                Core identity fields may be locked depending on the project stage.
              </p>
            </div>
          </div>

          <div className="form-grid">
            <label>
              App name

              <input
                value={
                  form.app_name
                }
                disabled={
                  !isFieldEditable(
                    "app_name"
                  )
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "app_name",
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              Android package name

              <input
                value={
                  form.package_name
                }
                disabled={
                  !isFieldEditable(
                    "package_name"
                  )
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "package_name",
                    event.target.value
                      .toLowerCase()
                      .replace(
                        /\s/g,
                        ""
                      )
                  )
                }
              />
            </label>

            <label className="full">
              App logo

              <div className="app-logo-upload">
                <div className="app-logo-upload-preview">
                  <AppLogoPreview
                    preview={
                      appLogoPreview
                    }
                    project={
                      removeCurrentLogo
                        ? {
                            ...project,
                            app_logo_url:
                              null,
                          }
                        : project
                    }
                  />
                </div>

                <div className="app-logo-upload-copy">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    disabled={
                      pendingCorrection &&
                      isCorrection
                    }
                    onChange={
                      selectLogo
                    }
                  />

                  <small>
                    Square PNG, JPG or WebP. Maximum size: 2 MB.
                  </small>

                  {appLogoFile && (
                    <button
                      type="button"
                      className="app-logo-remove"
                      onClick={
                        clearSelectedLogo
                      }
                    >
                      Remove selected file
                    </button>
                  )}

                  {!appLogoFile &&
                    project.app_logo_url &&
                    !isCorrection && (
                      <button
                        type="button"
                        className="app-logo-remove"
                        onClick={() => {
                          setRemoveCurrentLogo(
                            true
                          );

                          setAppLogoPreview(
                            ""
                          );
                        }}
                      >
                        Remove current logo
                      </button>
                    )}
                </div>
              </div>
            </label>

            {editMode ===
              "full" && (
              <label>
                Plan

                <select
                  value={
                    form.plan_id
                  }
                  disabled={
                    !isFieldEditable(
                      "plan_id"
                    )
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "plan_id",
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Select a plan
                  </option>

                  {plans.map(
                    (plan) => (
                      <option
                        key={
                          plan.id
                        }
                        value={
                          plan.id
                        }
                      >
                        {plan.name} — ₹
                        {plan.price_inr}
                      </option>
                    )
                  )}
                </select>
              </label>
            )}
          </div>
        </Card>

        <Card>
          <div className="card-head">
            <div>
              <h2>
                Contact and testing details
              </h2>

              <p>
                Make sure testers receive the correct joining links and instructions.
              </p>
            </div>
          </div>

          <div className="form-grid">
            <label>
              Mobile number

              <input
                value={
                  form.customer_phone
                }
                disabled={
                  !isFieldEditable(
                    "customer_phone"
                  )
                }
                inputMode="numeric"
                maxLength={10}
                onChange={(
                  event
                ) =>
                  updateField(
                    "customer_phone",
                    event.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
              />
            </label>

            <label className="full">
              Testing brief

              <textarea
                rows={6}
                value={
                  form.description
                }
                disabled={
                  !isFieldEditable(
                    "description"
                  )
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="full">
              Google Group URL

              <input
                type="url"
                value={
                  form.google_group_url
                }
                disabled={
                  !isFieldEditable(
                    "google_group_url"
                  )
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "google_group_url",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="full">
              Android opt-in URL

              <input
                type="url"
                value={
                  form.android_opt_in_url
                }
                disabled={
                  !isFieldEditable(
                    "android_opt_in_url"
                  )
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "android_opt_in_url",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="full">
              Web opt-in URL

              <input
                type="url"
                value={
                  form.web_opt_in_url
                }
                disabled={
                  !isFieldEditable(
                    "web_opt_in_url"
                  )
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "web_opt_in_url",
                    event.target.value
                  )
                }
              />
            </label>
          </div>
        </Card>

        {isCorrection && (
          <Card>
            <div className="card-head">
              <div>
                <h2>
                  Reason for correction
                </h2>

                <p>
                  Explain what is wrong and why changing it is necessary.
                </p>
              </div>
            </div>

            <label>
              Correction reason

              <textarea
                rows={5}
                value={reason}
                disabled={
                  Boolean(
                    pendingCorrection
                  )
                }
                placeholder="For example: The Google Play opt-in link was entered incorrectly and testers cannot access the app."
                onChange={(
                  event
                ) =>
                  setReason(
                    event.target.value
                  )
                }
              />
            </label>
          </Card>
        )}

        <div className="project-edit-actions">
          <Link
            className="button secondary"
            to={`/projects/${project.id}`}
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="button"
            disabled={
              submitting ||
              (
                isCorrection &&
                Boolean(
                  pendingCorrection
                )
              )
            }
          >
            {submitting ? (
              <>
                <LoaderCircle
                  className="spin"
                  size={17}
                />

                Saving…
              </>
            ) : (
              <>
                <Save size={17} />

                {isCorrection
                  ? "Submit correction request"
                  : "Save project changes"}
              </>
            )}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}