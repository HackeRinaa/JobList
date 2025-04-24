"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import useMediaQuery from "@mui/material/useMediaQuery";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

interface StepperProps {
  step: number;
  steps: { label: string }[];
}

const CustomStepper: React.FC<StepperProps> = ({ step, steps }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Box sx={{ width: "100%", marginBottom: "3rem" }}>
      {isMobile ? (
        // Mobile version
        <Box>
          <LinearProgress
            variant="determinate"
            value={(step / steps.length) * 100}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "#eee",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#FB7600",
              },
            }}
          />
          <Stack direction="row" spacing={2} justifyContent="space-between" mt={1}>
            {steps.map((s, index) => (
              <Typography
                key={index}
                variant="caption"
                sx={{
                  color: index + 1 === step ? "#FB7600" : "#aaa",
                  fontWeight: index + 1 === step ? "bold" : "normal",
                  fontSize: "12px",
                  textAlign: "center",
                  flex: 1,
                }}
              >
                {s.label}
              </Typography>
            ))}
          </Stack>
        </Box>
      ) : (
        // Desktop version
        <Stepper
          activeStep={step - 1}
          alternativeLabel
          sx={{
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          {steps.map((s, index) => (
            <Step
              key={index}
              sx={{
                "& .MuiStepLabel-root": {
                  color: "#FB7600",
                },
                "& .MuiStepIcon-root": {
                  color: "#ccc",
                  "&.Mui-completed": {
                    color: "#4caf50",
                  },
                  "&.Mui-active": {
                    color: "#FB7600",
                  },
                },
              }}
            >
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    fontSize: "16px",
                    fontWeight: "bold",
                    "&.Mui-active": {
                      color: "#FB7600",
                    },
                    "&.Mui-completed": {
                      color: "#4caf50",
                    },
                  },
                }}
              >
                {s.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
    </Box>
  );
};

export default CustomStepper;
