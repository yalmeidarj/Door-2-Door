import { FaSalesforce, FaUser } from "react-icons/fa"
import { FaGear, FaMapLocationDot } from "react-icons/fa6"
import { MdHome } from "react-icons/md"

// Define a type for nav item
export type NavItem = {
    name: string;
    icon: React.ReactNode;
    linkTemplate: string;
}

function splitCapitalize( text: string) {
    return text.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');   
}

export const createNavItems = (orgName: string) => ({
    
    header: [
        {
            name: "Home",
            icon: <MdHome />,
            link: `/org/${orgName.replace(" ", "-") }`
        },
        {
            name: "Admin",
            icon: <FaGear />,
            link: `/org/${orgName.replace(" ", "-") }/admin`
        },
        {
            name: `${splitCapitalize(orgName)}`,
            icon: <FaMapLocationDot />,
            link: `/org/${orgName.replace(" ", "-") }`
        }
    ],
    footer: [
        {
            name: "Salesforce",
            icon: <FaSalesforce />,
            link: `/org/${orgName.replace(" ", "-") }/seeding`
        }
    ],
    user: {
        name: "My Account",
        icon: <FaUser />,
        link: `/org/${orgName.replace(" ", "-") }/user`
    }
});

// export default navItems