"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Check, CheckCircle, ArrowRight } from "lucide-react";
import Button from "../ui/Button";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

import LoaderUi from "../ui/LoaderUi";
import ToastersUi from "../ui/ToastersUi";

import Icons from "../../assets/Icons";

/*Helpers */
import Utils from "../../helpers/utils";

/*handler*/
import EarlybirdsHandler from "../../handlers/earlybirds/earlybirds";

const EarlyAccessSection: React.FC = () => {
  const searchParams = useSearchParams();
  const earlybirdsHandle = new EarlybirdsHandler();

  // Define Params state type explicitly
  const [Params, setParams] = useState<Record<string, string>>({});

  const [email, setEmail] = useState<string>("");
  const [EmailInvalid, setEmailInvalid] = useState<boolean>(false);

  const [EmailDeBounce, setEmailDeBounce] = useState<NodeJS.Timeout | null>(
    null
  );

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [warningAlert, setWarningAlert] = useState<boolean>(false);
  const [warningAlertType, setWarningAlertType] = useState<string>("warning");
  const [warningAlertMessage, setwarningAlertMessage] = useState<string>(
    "Something went wrong"
  );

  const ValidateForm = (email: string) => {
    if (email) setEmailInvalid(!Utils.validateEmailFormat(email));
  };

  // Fix typing for event in input change handler
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setEmail(value);

    if (EmailDeBounce) clearTimeout(EmailDeBounce);

    setEmailDeBounce(setTimeout(() => ValidateForm(value), 1000));
  };

  // Fix typing for event in form submit handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (EmailInvalid) {
      setWarningAlert(true);
      setWarningAlertType("error");
      setwarningAlertMessage("Please enter valid email!");
      return;
    }

    let payload: Record<string, any> = {
      email,
    };

    if (Object.keys(Params).length) payload["params"] = JSON.stringify(Params);

    setIsLoading(true);
    let response = await earlybirdsHandle.create(payload);
    setIsLoading(false);

    if (!response.success) {
      setWarningAlert(true);
      setWarningAlertType("error");
      setwarningAlertMessage(
        response.message || "Failed to create, Please try again!"
      );
      return;
    }

    setIsSuccess(true);
    setEmail("");

    setTimeout(() => setIsSuccess(false), 5000);
  };

  useEffect(() => {
    const paramsToCheck = ["price_id", "price_duration"];
    const params_data: Record<string, string> = {};

    paramsToCheck.forEach((param) => {
      const value = searchParams.get(param);
      if (value) {
        params_data[param] = value;
      }
    });

    setParams(params_data);
  }, [searchParams]);

  return (
    <>
      {isLoading ? (
        <LoaderUi
          props={{
            isLabel: true,
          }}
        />
      ) : null}

      {warningAlert ? (
        <ToastersUi
          props={{
            type: warningAlertType,
            message: warningAlertMessage,
            callback: () => setWarningAlert(false),
          }}
        />
      ) : null}

      <section id="early-access" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 ">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 relative overflow-hidden border border-blue-100 shadow-sm mb-8">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              Over 1,000+ already joined
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Experience Ai SEO Writer First
            </h2>

            <p className="text-lg text-gray-700 mb-8">
              Join our early access program and get exclusive benefits, lower
              pricing, and priority support.
            </p>

            <div className="p-8 rounded-2xl ">
              {isSuccess ? (
                <motion.div
                  className="bg-green-50 border border-green-200 rounded-xl p-6 text-center max-w-md mx-auto"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-green-100 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Thank You for Joining!
                  </h3>
                  <p className="text-muted-foreground">
                    We've added you to our early access list. We'll be in touch
                    shortly with next steps.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col md:flex-row gap-3"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className={`flex-1 px-4 py-3 border  rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      EmailInvalid
                        ? "text-red-700 border-[2px] border-red-300 "
                        : " text-gray-700 border-gray-300 "
                    }`}
                    required
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className={` ${
                      EmailInvalid ? "opacity-40 cursor-[not-allowed]" : ""
                    }`}
                  >
                    <div
                      className="mr-2 h-5 w-5 fill-gray-100"
                      dangerouslySetInnerHTML={{ __html: Icons.default.rocket }}
                    ></div>{" "}
                    Unlock Early Access
                  </Button>
                </form>
              )}

              <div className="mt-4 flex flex-col md:flex-row justify-center gap-4 md:gap-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Lifetime Access</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Priority Support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Unlock Early Features</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              By signing up, you agree to our Terms of Use and Privacy Policy.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default EarlyAccessSection;
