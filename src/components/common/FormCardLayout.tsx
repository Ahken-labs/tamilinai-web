type FormCardLayoutProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode; // for buttons or extra content
  bottom?: React.ReactNode;
  paddingBottom?: string;
  childrenTopMargin?: string;
};

export default function FormCardLayout({
  title,
  subtitle,
  children,
  footer,
  bottom,
  paddingBottom = "pb-8 md:pb-10",
  childrenTopMargin = "mt-7 sm:mt-10 md:mt-12",
}: FormCardLayoutProps) {
  return (
    <div className="w-full flex justify-center px-4 py-8 bg-mvp font-poppins">
      <div className="w-full max-w-[784px] flex flex-col">

        <div className={`w-full rounded-[20px] bg-light pt-6 md:pt-8 px-4 md:px-6 ${paddingBottom}`}>
          
          {/* Title */}
          <h1 className="font-24 font-semibold text-dark leading-[150%]">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="mt-5 sm:mt-6 md:mt-8 lg:mt-10 font-18 font-normal text-dark leading-[150%]">
              {subtitle}
            </p>
          )}

          {/* Content */}
          <div className={childrenTopMargin}>
            {children}
          </div>

          {/* Footer (buttons etc.) */}
          {footer && (
            <div className="mt-10 md:mt-12">
              {footer}
            </div>
          )}
        </div>
        {bottom && <div className="mt-8">{bottom}</div>}
      </div>
    </div>
  );
}