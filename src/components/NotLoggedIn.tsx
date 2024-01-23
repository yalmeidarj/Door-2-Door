import { PiSealWarning } from "react-icons/pi";

const NotClockedIn = async () => {
    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-row gap-2 bg-sky-700 text-slate-100 p-2  rounded shadow items-center justify-center mt-4">
                <PiSealWarning className="text-2xl" />
                <p>Clock In in this site to edit it.</p>
            </div>
        </div>
    );
};

export default NotClockedIn;