import { Button } from "@/components/shadcn/ui/button";
import { toast } from "@/components/shadcn/ui/use-toast";
import logo from "/eventhub-logo.png";
import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { User } from "@/utils/types";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import HostLoginPage from "./host/HostLoginPage";
import HostRegisterPage from "./host/HostRegisterPage";

type JoinEventFormData = {
  eventCode: string;
  eventPassword: string;
  displayName: string;
};

const LandingPage = () => {
  const [optionSelected, setOptionSelected] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [showHostButtons, setShowHostButtons] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  useAppContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinEventFormData>();

  const div = `bg-[#08081d] min-h-screen w-screen flex flex-col items-center justify-center transition-all duration-300`;
  const buttonTextFormat = "text-3xl mx-8 px-8 py-6 font-alatsi";
  const TRANSITION_DURATION = 300;

  const joinEventMutation = useMutation<User, Error, JoinEventFormData>(
    async (data) => {
      const response = await fetch('/api/join-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to join event');
      }
      return response.json();
    },
    {
      onSuccess: () => {
        setIsLoading(false);
        toast({
          title: "Success",
          description: "Joined event successfully!",
        });
        navigate("/stream");
      },
      onError: (error: Error) => {
        setIsLoading(false);
        toast({
          title: "Join Error",
          description: error.message,
          variant: "destructive",
        });
      },
    }
  );

  const handleButtonClick = (option: string) => {
    if (optionSelected === option) {
      setTransitioning(true);
      setTimeout(() => {
        setOptionSelected(null);
        setTransitioning(false);
      }, TRANSITION_DURATION);
      return;
    }

    setTransitioning(true);
    try {
      setTimeout(() => {
        setOptionSelected(option);
        setTransitioning(false);
      }, TRANSITION_DURATION);
    } catch (error) {
      console.error(`Error in handleButtonClick: ${error}`);
      setTransitioning(false);
    }
  };

  const toggleHostMode = () => {
    setShowHostButtons(!showHostButtons);
    // Reset selected option when toggling host mode
    if (optionSelected === "join event") {
      setOptionSelected(null);
    }
  };

  const JoinEventForm = () => {
    const inputFieldFormat =
      "border rounded py-2 px-3.5 my-2 font-sans font-medium text-black text-lg";
    const errorTextFormat = "text-red-500";
    const labelFormat = "flex flex-col";
    const subDivFormat = "grid grid-cols-1 gap-4 max-w-md w-full mx-auto";

    const onFormSubmit = handleSubmit((data) => {
      setIsLoading(true);
      joinEventMutation.mutate(data);
    });

    return (
      <div className="text-white font-alatsi justify-center w-full max-w-2xl mx-auto p-6">
        <form onSubmit={onFormSubmit}>
          <div className={subDivFormat}>
            <label className={labelFormat}>
              Event Code
              <input
                className={inputFieldFormat}
                {...register("eventCode", {
                  required: "Event code is required",
                })}
              />
              {errors.eventCode && (
                <span className={errorTextFormat}>{errors.eventCode.message}</span>
              )}
            </label>

            <label className={labelFormat}>
              Event Password
              <input
                className={inputFieldFormat}
                type="password"
                {...register("eventPassword", {
                  required: "Event password is required",
                })}
              />
              {errors.eventPassword && (
                <span className={errorTextFormat}>{errors.eventPassword.message}</span>
              )}
            </label>

            <label className={labelFormat}>
              Display Name
              <input
                className={inputFieldFormat}
                {...register("displayName", {
                  required: "Display name is required",
                })}
              />
              {errors.displayName && (
                <span className={errorTextFormat}>{errors.displayName.message}</span>
              )}
            </label>

            <Button
              type="submit"
              variant="secondary"
              className="mt-4 font-alatsi text-base"
            >
              Join Event
            </Button>
          </div>
        </form>
      </div>
    );
  };

  const renderContent = () => {
    switch (optionSelected) {
      case "login":
        return <HostLoginPage />;
      case "register":
        return <HostRegisterPage />;
      case "join event":
        return <JoinEventForm />;
      default:
        return null;
    }
  };

  return (
    <div className={div}>
      <Button
        onClick={toggleHostMode}
        variant="ghost"
        className="absolute top-4 right-4 text-2xl px-4 py-2 bg-white text-black rounded"
      >
        {showHostButtons ? "Back" : "Host"}
      </Button>

      <div className={`flex flex-col transition-all duration-300 ${
        optionSelected === null ? "" : "scale-90"
      }`}>
        <img
          src={logo}
          alt="EventHub Logo"
          className="py-2 max-w-[800px] w-full cursor-pointer"
          onClick={() => {
            handleButtonClick("");
            setShowHostButtons(false);
          }}
        />

        <div className="text-white">
          <div className="py-4 text-center">
            {!showHostButtons && (
              <Button
                onClick={() => handleButtonClick("join event")}
                variant="ghost"
                className={buttonTextFormat}
              >
                Join Event
              </Button>
            )}

            {showHostButtons && (
              <>
                <Button
                  onClick={() => handleButtonClick("login")}
                  variant="ghost"
                  className={buttonTextFormat}
                >
                  Host Login
                </Button>
                <Button
                  variant="ghost"
                  className={buttonTextFormat}
                  onClick={() => handleButtonClick("register")}
                >
                  Host Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className={`items-center transition-opacity duration-300 ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {renderContent()}
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center bg-black bg-opacity-70">
          <h2 className="text-s font-bold font-alatsi text-white">Loading</h2>
          <LoadingSpinner className="size-12 my-2" />
        </div>
      )}
    </div>
  );
};

export default LandingPage;