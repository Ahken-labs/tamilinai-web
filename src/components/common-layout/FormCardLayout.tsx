type FormCardLayoutProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode; // for buttons or extra content
  bottom?: React.ReactNode;
  paddingBottom?: string;
  childrenTopMargin?: string;
  subtitleMarginTop?:string;
  bgColor?: string;
  maxwidth?: string;
  paddingHorizontal?:string;
  minHeight?: string;
};

export default function FormCardLayout({
  title,
  subtitle,
  children,
  footer,
  bottom,
  paddingBottom = "pb-6 sm:pb-8 md:pb-10",
  childrenTopMargin = "max-[500px]:mt-6 mt-8 md:mt-12",
  subtitleMarginTop = "max-[500px]:mt-2 mt-4 md:mt-6 lg:mt-10",
  bgColor = "bg-light",
  maxwidth = "max-w-[784px]",
  paddingHorizontal = "px-4 md:px-6",
  minHeight = "min-h-[calc(100vh-80px)]"
}: FormCardLayoutProps) {
  return (
    <div className={`w-full flex justify-center max-[340px]:px-2 px-4 md:px-10 max-[500px]:py-4 py-8 bg-mvp font-poppins ${minHeight}`}>
      <div className={`w-full ${maxwidth} flex flex-col`}>

        <div className={`w-full rounded-[16px] sm:rounded-[20px] ${paddingHorizontal} ${bgColor} ${paddingBottom}`}>
          
          {/* Title */}
          {title && (
          <h1 className="fonts-24 font-semibold pt-6 md:pt-8 text-dark leading-[150%]">
            {title}
          </h1>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p className={ `${subtitleMarginTop} fonts-18 font-normal text-dark leading-[150%]`}>
              {subtitle}
            </p>
          )}

          {/* Content */}
          <div className={childrenTopMargin}>
            {children}
          </div>

          {/* Footer (buttons etc.) */}
          {footer && (
            <div className="mt-6 sm:mt-8 md:mt-12">
              {footer}
            </div>
          )}
        </div>
        {bottom && <div className="max-[500px]:mt-4 mt-8">{bottom}</div>}
      </div>
    </div>
  );
}