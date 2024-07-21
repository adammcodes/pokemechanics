export default function Box({
  headingText,
  children,
}: {
  headingText: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`card__border h-full p-3 flex flex-col gap-y-3 w-full lg:w-[300px]`}
    >
      <h2 className="text-2xl leading-none">{headingText}</h2>
      {children}
    </div>
  );
}
