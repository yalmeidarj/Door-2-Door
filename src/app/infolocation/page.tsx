import InfoFeed from "@/components/infoFeed/InfoFeed";

export default async function Page() {

    return (
        <div className='flex flex-col gap-4 mx-auto items-center '>
            <div className='flex justify-center flex-wrap flex-row gap-0 mx-auto items-center '>            
            <InfoFeed isActive={false} />
            </div>
            <h1
            className="text-3xl md:text-4xl font-semibold text-gray-900"
            >Inactive Sites</h1>
            <InfoFeed 
            isActive={true}
            />
        </div>
    );
}


