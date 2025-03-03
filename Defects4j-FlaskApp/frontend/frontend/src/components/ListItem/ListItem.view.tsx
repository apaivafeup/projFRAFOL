import React, { Suspense } from "react";

export interface ListItem {
  title: string;
  logo: React.ReactNode;
  onSuccess: (id: string) => void;
  onDecline: () => void;
}

function ListItemView({ title, logo, onSuccess, onDecline }: ListItem) {
  return ( 
    <Suspense  fallback={<div className="w-full rounded-lg p-4 bg-gray-200">l</div>}>
    <div
      className={`w-full items-center rounded-lg border-gray-200 hover:border-blue-200 border-1 flex flex-row p-2 pl-4 pr-4 justify-between`}
    >
      <div className="flex flex-row items-center justify-center gap-2">
        {logo}
        <div>{title}</div>
      </div>
      <div className="flex flex-row font-semibold  items-center justify-center gap-2">
        <button
          onClick={() => {
            onSuccess(title);
          }}
          style={{ borderRadius: 8 }}
          className="p-2 hover:bg-blue-500 hover:scale-110  ease-in duration-200 text-blue-500 hover:text-white bg-blue-200 items-center"
        >
          Accept
        </button>
        <button
          onClick={onDecline}
          style={{ borderRadius: 8 }}
          className="p-2 rounded-lg bg-red-300 hover:bg-red-400 hover:scale-110  ease-in duration-200 hover:text-white items-center"
        >
          Decline
        </button>
      </div>
    </div>
    </Suspense>
  );
}

export default ListItemView;
