import { FcAbout } from "react-icons/fc";
import { GrStatusUnknown } from "react-icons/gr";

type FormWrapperProps = {
    children: React.ReactNode;
    title: string;
    description: string;
};

export function FormWrapper({ children, title, description }: FormWrapperProps) {
    return (
        <>

            <div className=" max-w-lg mt-6 p-4 border-solid border-4 bg-slate-200 border-gray-200 rounded-lg shadow-md">
                <header className='group w-full text-start border-b-2 bg-slate-400 rounded-lg p-4 mb-6'>
                    <section className='flex flex-row items-center gap-2'>
                        <h1 className="font-semibold text-xl text-slate-100">
                            {title}
                        </h1>
                        <GrStatusUnknown className="text-gray-600" aria-label="Status Unknown" />
                    </section>
                    <section className='invisible absolute max-w-xs bg-white text-gray-800 rounded-lg p-4 shadow-lg border border-gray-300 group-focus:visible group-hover:visible transition-all duration-300 ease-in-out' tabIndex={0}>
                        <FcAbout className="text-lg" aria-label="About" />
                        <p className='text-sm text-justify mt-2'>
                            {description}
                        </p>
                    </section>
                </header>
                {children}
            </div>
        </>
    );
}