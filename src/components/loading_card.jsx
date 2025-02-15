const LoadingAnimationCard = () => {
  return (
    <div>
      <div className="mx-auto w-full max-w-sm rounded-md border border-black p-4">
        <div className="flex animate-pulse space-x-4">
          <div className="size-10 rounded-full bg-black"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 rounded bg-black"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-2 rounded bg-black"></div>
                <div className="col-span-1 h-2 rounded bg-black"></div>
              </div>
              <div className="h-2 rounded bg-black"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimationCard;
