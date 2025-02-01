import { getPaymentInfo } from "@/actions/user";

const BillingPage = async () => {
  const payment = await getPaymentInfo();

  return (
    <div className="bg-card flex flex-col gap-y-8 p-5 rounded-xl">
      <div>
        <h2 className="text-2xl text-foreground">Current Plan</h2>
        <p className="text-muted-foreground">Your Payment History</p>
      </div>
      <div>
        <h2 className="text-2xl text-foreground">
          ${payment?.data?.subscription?.plan === "PRO" ? "99" : "0"}/Month
        </h2>
        <p className="text-muted-foreground">{payment?.data?.subscription?.plan}</p>
      </div>
    </div>
  );
};

export default BillingPage;
