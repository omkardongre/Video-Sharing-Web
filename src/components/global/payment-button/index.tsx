import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import Loader from "../loader";

const PaymentButton = () => {
  const { onSubscribe, isProcessing } = useSubscription();

  return (
    <Button className="text-sm w-full " onClick={onSubscribe}>
      <Loader color="#000" state={isProcessing}>
        Upgrade
      </Loader>
    </Button>
  );
};

export default PaymentButton;
