// components/Stepper.tsx
"use client";
// components/Stepper.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

interface StepperProps {
  step: number;
  steps: { label: string }[];
}

const CustomStepper: React.FC<StepperProps> = ({ step, steps }) => {
  return (
    <Box sx={{ width: "100%", marginBottom: "3rem" }}>
      <Stepper
        activeStep={step - 1}
        alternativeLabel
        sx={{
          // Customize the Stepper container
          padding: "16px", // Add padding
          borderRadius: "8px", // Rounded corners
        }}
      >
        {steps.map((s, index) => (
          <Step
            key={index}
            sx={{
              width: "30px",
              height: "30px",
              // Customize each Step
              "& .MuiStepLabel-root": {
                // Target the StepLabel
                color: "#FB7600", // Orange text for active/inactive steps
              },
              "& .MuiStepIcon-root": {
                // Target the StepIcon (circle)
                color: "#ccc", // Default color for inactive steps
                "&.Mui-completed": {
                  color: "#4caf50", // Green color for completed steps
                },
                "&.Mui-active": {
                  color: "#FB7600", // Orange color for active steps
                },
              },
            }}
          >
            <StepLabel
              sx={{
                // Customize the StepLabel text
                "& .MuiStepLabel-label": {
                  fontSize: "16px", 
                  fontWeight: "bold", // Bold text
                  "&.Mui-active": {
                    color: "#FB7600", // Orange text for active steps
                  },
                  "&.Mui-completed": {
                    color: "#4caf50", // Green text for completed steps
                  },
                },
              }}
            >
              {s.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default CustomStepper;