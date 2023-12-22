import { redirect } from 'next/navigation'
// import { getServerSession } from "next-auth/next"
import { getServerSession } from "next-auth"
import { authOptions } from '@/server/auth';
import Image from 'next/image'
import { db } from '@/server/db';



export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return redirect("/api/auth/signin");
    }

    const user = await db.user.findUnique({
        where: {
            id: session.user.id,
        }
    })

    if (!user) {
        return (
            <div className=' '>
                No user in the db!
            </div>
        );
    }

    // const location = db.location.findMany()


    return (
        <>
            <h1>Name:</h1>
            <h1>{session.user.name}</h1>
            <Image
                src={`${session.user.image}`}
                alt=''
                width={24}
                height={24}
            >
            </Image>
            <h1>Found user in DB: {user.name}
            </h1>
            {/* <h1>Found user in DB: {(await location).length}</h1> */}
            {/* <h1>{user.createdAt.toLocaleString()}</h1> */}
        </>
    );
}
// if (!session) {
//     // return redirect("/api/auth/signin");
//     return (
//         <div className=' '>
//         NO FUCKING SESSION!
//         </div>
//     );
// }




