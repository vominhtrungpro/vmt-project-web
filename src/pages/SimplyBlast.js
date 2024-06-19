import React, { useState } from "react";
import "./SimplyBlast.css";
import SimplyBlastStep1 from "./components/SimplyBlastStep1";
import SimplyBlastStep2 from "./components/SimplyBlastStep2";
import SimplyBlastStep3 from "./components/SimplyBlastStep3";

const Step1 = () => <div>Bước 1</div>;

const SimplyBlast = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SimplyBlastStep1
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onNext={handleNextStep1}
          />
        );
      case 2:
        return (
          <SimplyBlastStep2
            onPrevious={handlePreviousStep2}
            onNext={handleNextStep2}
            token={token}
          />
        );
        case 3:
          return (
            <SimplyBlastStep3
              onPrevious={handlePreviousStep3}
              onNext={handleNextStep3}
              token={token}
            />
          );
      default:
        return <Step1 />;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep1 = (responseData) => {
    setToken(responseData.data.accessToken);
    nextStep();
  };

  const handleNextStep2 = () => {
    nextStep();
  };

  const handleNextStep3 = () => {
    nextStep();
  };

  const handlePreviousStep2 = () => {
    prevStep();
  };

  const handlePreviousStep3 = () => {
    prevStep();
  };

  return (
    <div>
      <div className="center-div">
        <div
          className={`step ${currentStep === 1 ? "active" : ""}`}
        >
          Step 1
        </div>
        <div
          className={`step ${currentStep === 2 ? "active" : ""}`}
        >
          Step 2
        </div>
        <div
          className={`step ${currentStep === 3 ? "active" : ""}`}
        >
          Step 3
        </div>
      </div>
      <div>{renderStep()}</div>
    </div>
  );
};

export default SimplyBlast;
