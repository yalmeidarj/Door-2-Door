
import { PiSealWarning } from "react-icons/pi";
import { Separator } from "./ui/separator";

function NotClockedIn() {
    return (
        <div className="flex items-center justify-center gap-1 w-full ">

            <div className="flex flex-row gap-2 bg-night text-slate-100 p-2  rounded shadow items-center justify-center mt-4">
                <PiSealWarning className="text-4xl m-1" />
                <Separator
                    orientation="vertical"
                    className="bg-night h-14"
                />
            <div className="flex flex-col gap-2 0  mt-">
                <h1 className="text-xl font-bold">Please clock in to continue</h1>
                    <h2 className="text-md font-semibold">Clock in <span className="font-bold text-green-200">the site you want to manage</span></h2>
            </div>
            </div>
        </div>
    );
};

export default NotClockedIn;