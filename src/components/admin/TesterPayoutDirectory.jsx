import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  Copy,
  LoaderCircle,
  RefreshCw,
  Search,
  WalletCards,
} from "lucide-react";

import {
  Badge,
  Card,
  Empty,
} from "../UI";

import {
  adminPayoutDirectory,
} from "../../lib/api";


function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date);
}


export default function TesterPayoutDirectory() {
  const [items, setItems] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [copiedId, setCopiedId] =
    useState(null);


  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await adminPayoutDirectory();

      setItems(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      setError(
        err.message ||
          "Could not load tester payout details."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    load();
  }, []);


  const visibleItems =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return items;
      }

      return items.filter(
        (item) => {
          const tester =
            item.tester || {};

          return [
            tester.full_name,
            tester.email,
            tester.device_model,
            item.upi_id,
            item.account_name,
          ]
            .filter(Boolean)
            .some(
              (value) =>
                String(value)
                  .toLowerCase()
                  .includes(query)
            );
        }
      );
    }, [items, search]);


  const copyUpi = async (
    item
  ) => {
    try {
      await navigator.clipboard
        .writeText(
          item.upi_id
        );

      setCopiedId(
        item.user_id
      );

      window.setTimeout(
        () => {
          setCopiedId(null);
        },
        1800
      );
    } catch {
      setError(
        "Could not copy the UPI ID."
      );
    }
  };


  return (
    <Card className="payout-directory-card">
      <div className="card-head">
        <div>
          <h2>
            Tester payout directory
          </h2>

          <p>
            View saved tester UPI
            details before rewards become
            eligible.
          </p>
        </div>

        <button
          type="button"
          className="button secondary"
          onClick={load}
          disabled={loading}
        >
          {loading ? (
            <LoaderCircle
              className="spin"
              size={17}
            />
          ) : (
            <RefreshCw
              size={17}
            />
          )}

          Refresh
        </button>
      </div>


      {error && (
        <div className="alert error">
          {error}
        </div>
      )}


      <div className="payout-directory-toolbar">
        <div className="payout-directory-total">
          <WalletCards
            size={18}
          />

          <span>
            Saved payout methods
          </span>

          <strong>
            {items.length}
          </strong>
        </div>

        <label className="payout-directory-search">
          <Search size={17} />

          <input
            type="search"
            value={search}
            placeholder="Search tester, email or UPI ID"
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />
        </label>
      </div>


      {loading && !items.length ? (
        <div className="full-loader inline-loader">
          <LoaderCircle
            className="spin"
          />

          Loading payout directory…
        </div>
      ) : visibleItems.length ? (
        <div className="table-wrap">
          <table className="payout-directory-table">
            <thead>
              <tr>
                <th>Tester</th>
                <th>UPI details</th>
                <th>Device</th>
                <th>Reliability</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {visibleItems.map(
                (item) => {
                  const tester =
                    item.tester || {};

                  const copied =
                    copiedId ===
                    item.user_id;

                  return (
                    <tr
                      key={
                        item.user_id
                      }
                    >
                      <td>
                        <strong>
                          {tester.full_name ||
                            item.account_name ||
                            "Unnamed tester"}
                        </strong>

                        <small>
                          {tester.email ||
                            "Email unavailable"}
                        </small>

                        {tester.country && (
                          <small>
                            {tester.country}
                          </small>
                        )}
                      </td>

                      <td>
                        <div className="directory-upi">
                          <strong>
                            {item.upi_id}
                          </strong>

                          <small>
                            {item.account_name ||
                              "Account name not added"}
                          </small>

                          <Badge tone="green">
                            {item.payout_type ||
                              "upi"}
                          </Badge>
                        </div>
                      </td>

                      <td>
                        <strong>
                          {tester.device_model ||
                            "Not added"}
                        </strong>

                        <small>
                          {tester.android_version
                            ? `Android ${tester.android_version}`
                            : ""}
                        </small>
                      </td>

                      <td>
                        <strong>
                          {tester.reliability_score ??
                            100}
                          %
                        </strong>
                      </td>

                      <td>
                        {formatDate(
                          item.updated_at
                        )}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="button secondary small"
                          onClick={() =>
                            copyUpi(item)
                          }
                        >
                          {copied ? (
                            <Check
                              size={16}
                            />
                          ) : (
                            <Copy
                              size={16}
                            />
                          )}

                          {copied
                            ? "Copied"
                            : "Copy UPI"}
                        </button>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      ) : items.length ? (
        <Empty
          title="No matching testers"
          body="Try another tester name, email address or UPI ID."
        />
      ) : (
        <Empty
          title="No payout details saved"
          body="Tester payout methods will appear here after testers save their UPI details."
        />
      )}
    </Card>
  );
}