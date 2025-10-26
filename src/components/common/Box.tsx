export default function Box({
  headingText,
  children,
  dataTestId,
}: {
  headingText: string;
  children: React.ReactNode;
  dataTestId?: string;
}) {
  return (
    <div
      className={`card__border h-full p-3 flex flex-col gap-y-3 w-full lg:w-[300px] max-h-[425px] overflow-y-auto`}
      data-testid={dataTestId}
    >
      <h2 className="text-2xl leading-none">{headingText}</h2>
      {children}
    </div>
  );
}
