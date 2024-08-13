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
        imgURL: 'https://res.cloudinary.com/djqdugthw/image/upload/t_siteExamples/v1721292829/bv1po9i096v6ssobzaxp.png'
    },
    {
        href: 'https://facottry-hotstar.vercel.app',
        title: 'Hotstar',
        id: 'hotstar_demo',
        desc: 'Build a Hotstar clone with FacOTTry',
        imgURL: 'https://res.cloudinary.com/djqdugthw/image/upload/t_siteExamples/v1721292829/p7nv0k4vzssrcrlvxbvm.png'
    },
    {
        href: 'https://facottry-ecommerce.vercel.app',
        title: 'Apneck',
        id: 'apneck_demo',
        desc: 'Build an e-commerce site with FacOTTry',
        imgURL: 'https://res.cloudinary.com/djqdugthw/image/upload/t_siteExamples/v1721292829/izalw7vhywgrgiw82us3.png'
    },
    {
        href: 'https://facottry-zee5.onrender.com',
        title: 'Zee5',
        id: 'zee5_demo',
        desc: 'Build an Zee5 clone with FacOTTry',
        imgURL: 'https://res.cloudinary.com/djqdugthw/image/upload/t_siteExamples/v1723539496/Screenshot_385_xazfyf.png'
    },
    {
        href: 'https://facottry-streamo.onrender.com',
        title: 'Streamo',
        id: 'streamo_demo',
        desc: 'Build an OTT platform with FacOTTry',
        imgURL: 'https://res.cloudinary.com/djqdugthw/image/upload/t_siteExamples/v1723289463/Screenshot_383_varjqi.png'
    },
]

const SiteExamples = (props: Props) => {
    const [projects] = userStore(state => [state.projects]);

    const netflixDemo = projects.find((project) => (project.name === 'NETFLIX_DEMO') && (project.type === 'TEST'))
    const hotstarDemo = projects.find((project) => (project.name === 'HOTSTAR_DEMO') && (project.type === 'TEST'))
    const apneckDemo = projects.find((project) => (project.name === 'APNECK_DEMO') && (project.type === 'TEST'))
    const streamoDemo = projects.find((project) => (project.name === 'STREAMO_DEMO') && (project.type === 'TEST'))
    const zee5Demo = projects.find((project) => (project.name === 'ZEE5_DEMO') && (project.type === 'TEST'))

    const projectIDs = [netflixDemo?.projectID, hotstarDemo?.projectID, apneckDemo?.projectID, streamoDemo?.projectID, zee5Demo?.projectID]

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