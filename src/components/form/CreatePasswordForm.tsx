"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, EyeOffIcon, EyeOnIcon } from "../../assets/Icons";
import Button from "../common/Button";
import InputBox from "../common/InputBox";
import FormCardLayout from "../common/FormCardLayout";
import { useLang } from "@/src/context/LangContext";

type Props = {
    variant?: "register" | "reset";
};

export default function CreatePasswordForm({ variant = "register" }: Props) {
    const { t } = useLang();
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const [passwordFocused, setPasswordFocused] = useState(false);
    const [confirmFocused, setConfirmFocused] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const passwordRules = useMemo(
        () => [
            {
                key: "length",
                label: "8+ characters",
                met: password.length >= 8,
            },
            {
                key: "uppercase",
                label: "One uppercase letter",
                met: /[A-Z]/.test(password),
            },
            {
                key: "number",
                label: "One number",
                met: /\d/.test(password),
            },
            {
                key: "symbol",
                label: "One symbol",
                met: /[^A-Za-z0-9]/.test(password),
            },
        ],
        [password]
    );

    const allRulesMet = passwordRules.every((rule) => rule.met);
    const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

    const showPasswordRules =
        passwordFocused ||
        confirmFocused ||
        password.length > 0 ||
        confirmPassword.length > 0 ||
        submitted;

    const showMatchLine =
        confirmFocused ||
        confirmPassword.length > 0 ||
        password.length > 0 ||
        submitted;

    const handleContinue = () => {
        setSubmitted(true);

        if (!password.trim()) {
            setPasswordError("*Password is Required");
            return;
        }
        if (!confirmPassword.trim()) {
            setConfirmPasswordError("*Confirm password is Required");
            return;
        }
        if (!allRulesMet) {
            setPasswordError("");
            setConfirmPasswordError("");
            return;
        }
        if (password !== confirmPassword) {
            setConfirmPasswordError("*Passwords do not match");
            return;
        }
        setPasswordError("");
        setConfirmPasswordError("");
        router.push(variant === "reset" ? "/login" : "/basic-details");
    };

    const handlePasswordBlur = () => {
        setPasswordFocused(false);
        if (password.length > 0 && !allRulesMet) {
            setSubmitted(true);
        }
    };

    const handleConfirmBlur = () => {
        setConfirmFocused(false);
    };

    return (
        <FormCardLayout
            title={variant === "reset" ? t("Create_a_new_password") : t("Create_your_password")}
            subtitle={variant === "reset" ? t("Reset_new_password_subtitle") : t("Create_new_password_subtitle")}
            footer={
                <div >
                    <Button
                        text={variant === "reset" ? t("Save_new_password") : t("Continue")}
                        icon={<ArrowRightIcon />}
                        onPress={handleContinue}
                        className="flex w-full"
                    />
                </div>
            }
        >
            <InputBox
                value={password}
                onChange={(val) => {
                    setPassword(val);
                    setPasswordError("");
                }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={handlePasswordBlur}
                label="Password"
                type={showPassword ? "text" : "password"}
                className="bg-[#F2F2F2] border-[#F2F2F2]"
                error={passwordError}
                suffix={
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="cursor-pointer"
                    >
                        {showPassword ? <EyeOnIcon /> : <EyeOffIcon />}
                    </button>
                }
            />

            {showPasswordRules && (
                <div className="mt-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {passwordRules.map((rule) => {
                            const textClass = rule.met
                                ? "text-green"
                                : submitted || (!passwordFocused && password.length > 0)
                                    ? "text-primary"
                                    : "text-secondary4";

                            return (
                                <div
                                    key={rule.key}
                                    className={`font-14 font-normal leading-[125%] ${textClass}`}
                                >
                                    • {rule.label}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="mt-6 md:mt-8">
                <InputBox
                    value={confirmPassword}
                    onChange={(val) => {
                        setConfirmPassword(val);
                        setConfirmPasswordError("");
                    }}
                    onFocus={() => setConfirmFocused(true)}
                    onBlur={handleConfirmBlur}
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="bg-[#F2F2F2] border-[#F2F2F2]"
                    error={confirmPasswordError}
                    suffix={
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            className="cursor-pointer"
                        >
                            {showConfirmPassword ? <EyeOnIcon /> : <EyeOffIcon />}
                        </button>
                    }
                />

                {showMatchLine && confirmPassword.length > 0 && password.length > 0 && (
                    <div
                        className={`mt-3 font-14 font-normal leading-[125%] ${passwordsMatch ? "text-green" : "text-primary"
                            }`}
                    >
                        • Passwords match
                    </div>
                )}
            </div>
        </FormCardLayout>
    );
}