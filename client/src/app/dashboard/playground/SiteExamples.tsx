import Link from "next/link"
import { userStore } from "@/lib/store"
import ExampleCard from "./ExampleCard"

type Props = {}

const cardData = [
    {
        href: 'https://facottry-netflix.vercel.app',
        title: 'Netflix',
        id: 'netflix_demo',
        desc: 'Build a Netflix clone with FacOTTry',
        imgURL: 'https://res.cloudinary.com/djqdugthw/image/upload/v1721292829/bv1po9i096v6ssobzaxp.png'
    },
    {
        href: 'https://facottry-hotstar.vercel.app',
        title: 'Hotstar',
        id: 'hotstar_demo',
        desc: 'Build a Hotstar clone with FacOTTry',
        imgURL: 'https://res.cloudinary.com/djqdugthw/image/upload/v1721292829/p7nv0k4vzssrcrlvxbvm.png'
    },
    {
        href: 'https://facottry-ecommerce.vercel.app',
        title: 'Apneck',
        id: 'apneck_demo',
        desc: 'Build an e-commerce site with FacOTTry',
        imgURL: 'https://res.cloudinary.com/djqdugthw/image/upload/v1721292829/izalw7vhywgrgiw82us3.png'
    }
]

const SiteExamples = (props: Props) => {
    const [projects] = userStore(state => [state.projects]);

    const netflixDemo = projects.find((project) => (project.name === 'NETFLIX_DEMO') && (project.type === 'TEST'))
    const hotstarDemo = projects.find((project) => (project.name === 'HOTSTAR_DEMO') && (project.type === 'TEST'))
    const apneckDemo = projects.find((project) => (project.name === 'APNECK_DEMO') && (project.type === 'TEST'))

    const projectIDs = [netflixDemo?.projectID, hotstarDemo?.projectID, apneckDemo?.projectID]

    return (
        <div className="bg-white w-full rounded-md p-5 mt-4 text-sm">
            <h1 className="text-lg font-semibold">Site Examples</h1>
            <p className="text-gray-500 mt-2">Here are some examples of sites that you can build with FacOTTry</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {cardData.map((card, index) => {
                    const projectID = projectIDs.find((projectID) => projectID && projectID.includes(card.id))

                    const cardURL = projectID ? `${card.href}?projectID=${projectID}` : card.href

                    return (
                        <ExampleCard key={index} href={cardURL} title={card.title} desc={card.desc} imgURL={card.imgURL} />
                    )
                })}
            </div>
        </div>
    )
}

export default SiteExamples

// < Link target = "_blank" href = {`https://facottry-hotstar.vercel.app?projectID=${hotstarDemo?.projectID}`} className = "bg-gray-100 p-4 rounded-md border shadow-sm hover:bg-gray-200 hover:scale-105 transition-all" >
//                 <h1 className="text-lg font-semibold">Hotstar</h1>
//                 <p className="text-gray-500 mt-2">Build a Hotstar clone with FacOTTry</p>
//             </ >

// <Link target="_blank" href={`https://facottry-ecommerce.vercel.app?projectID=${apneckDemo?.projectID}`} className="bg-gray-100 p-4 rounded-md border shadow-sm hover:bg-gray-200 hover:scale-105 transition-all">
//     <h1 className="text-lg font-semibold">E-commerce</h1>
//     <p className="text-gray-500 mt-2">Build an e-commerce site with FacOTTry</p>
// </Link>