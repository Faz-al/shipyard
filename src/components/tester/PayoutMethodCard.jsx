import {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Copy,
  IndianRupee,
  LoaderCircle,
  Save,
  Trash2,
  WalletCards,
} from "lucide-react";

import {
  Card,
} from "../UI";

import {
  deleteMyPayoutMethod,
  getMyPayoutMethod,
  saveMyPayoutMethod,
} from "../../lib/api";


export default function PayoutMethodCard() {
  const [payout, setPayout] =
    useState(null);

  const [upiId, setUpiId] =
    useState("");

  const [
    accountName,
    setAccountName,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getMyPayoutMethod();

      setPayout(data || null);

      setUpiId(
        data?.upi_id || ""
      );

      setAccountName(
        data?.account_name || ""
      );
    } catch (err) {
      setError(
        err.message ||
          "Could not load payout details."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    load();
  }, []);


  const save = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const data =
        await saveMyPayoutMethod({
          upiId,
          accountName,
        });

      setPayout(data);

      setUpiId(
        data?.upi_id || upiId
      );

      setAccountName(
        data?.account_name ||
          accountName
      );

      setMessage(
        "Your payout details were saved."
      );
    } catch (err) {
      setError(
        err.message ||
          "Could not save payout details."
      );
    } finally {
      setSaving(false);
    }
  };


  const remove = async () => {
    const confirmed =
      window.confirm(
        "Remove your saved payout details?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setMessage("");
      setError("");

      await deleteMyPayoutMethod();

      setPayout(null);
      setUpiId("");
      setAccountName("");

      setMessage(
        "Your payout details were removed."
      );
    } catch (err) {
      setError(
        err.message ||
          "Could not remove payout details."
      );
    } finally {
      setDeleting(false);
    }
  };


  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(
        payout?.upi_id || upiId
      );

      setMessage(
        "UPI ID copied."
      );
    } catch {
      setError(
        "Could not copy the UPI ID."
      );
    }
  };


  return (
    <Card className="payout-card">
      <div className="card-head">
        <div>
          <h2>
            Payout details
          </h2>

          <p>
            Add the UPI ID where your
            approved testing rewards
            should be paid.
          </p>
        </div>

        <div className="payout-card-icon">
          <WalletCards size={22} />
        </div>
      </div>


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


      {loading ? (
        <div className="full-loader inline-loader">
          <LoaderCircle
            className="spin"
          />

          Loading payout details…
        </div>
      ) : (
        <>
          {payout && (
            <div className="saved-payout">
              <div>
                <CheckCircle2
                  size={18}
                />

                <span>
                  Saved payout method
                </span>
              </div>

              <strong>
                {payout.upi_id}
              </strong>

              <small>
                {payout.account_name ||
                  "Account holder name not added"}
              </small>

              <button
                type="button"
                className="button secondary small"
                onClick={copyUpi}
              >
                <Copy size={16} />
                Copy UPI ID
              </button>
            </div>
          )}


          <form
            className="payout-form"
            onSubmit={save}
          >
            <label>
              UPI ID

              <div className="input-with-icon">
                <IndianRupee
                  size={18}
                />

                <input
                  type="text"
                  value={upiId}
                  placeholder="name@bank"
                  autoComplete="off"
                  onChange={(event) =>
                    setUpiId(
                      event.target.value
                    )
                  }
                />
              </div>

              <small>
                Example: fazal@oksbi
              </small>
            </label>


            <label>
              Account holder name

              <input
                type="text"
                value={accountName}
                placeholder="Name linked to the UPI account"
                onChange={(event) =>
                  setAccountName(
                    event.target.value
                  )
                }
              />
            </label>


            <div className="payout-actions">
              {payout && (
                <button
                  type="button"
                  className="button secondary"
                  disabled={
                    deleting ||
                    saving
                  }
                  onClick={remove}
                >
                  {deleting ? (
                    <LoaderCircle
                      className="spin"
                      size={17}
                    />
                  ) : (
                    <Trash2
                      size={17}
                    />
                  )}

                  Remove
                </button>
              )}

              <button
                type="submit"
                className="button"
                disabled={
                  saving ||
                  deleting ||
                  !upiId.trim()
                }
              >
                {saving ? (
                  <LoaderCircle
                    className="spin"
                    size={17}
                  />
                ) : (
                  <Save size={17} />
                )}

                Save payout details
              </button>
            </div>
          </form>


          <p className="payout-security-note">
            Shipyard only shows these
            details to you and platform
            administrators handling reward
            payments.
          </p>
        </>
      )}
    </Card>
  );
}