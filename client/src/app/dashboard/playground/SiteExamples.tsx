import Link from "next/link"
import { userStore } from "@/lib/store"

type Props = {}

const SiteExamples = (props: Props) => {
    const [projects] = userStore(state => [state.projects]);

    const netflixDemo = projects.find((project) => (project.name === 'NETFLIX_DEMO') && (project.type === 'TEST'))
    const hotstarDemo = projects.find((project) => (project.name === 'HOTSTAR_DEMO') && (project.type === 'TEST'))
    const apneckDemo = projects.find((project) => (project.name === 'APNECK_DEMO') && (project.type === 'TEST'))

    return (
        <div className="bg-white w-full rounded-md p-5 mt-4 text-sm">
            <h1 className="text-lg font-semibold">Site Examples</h1>
            <p className="text-gray-500 mt-2">Here are some examples of sites that you can build with FacOTTry</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <Link target="_blank" href={`https://facottry-netflix.vercel.app?projectID=${netflixDemo?.projectID}`} className="bg-gray-100 p-4 rounded-md border shadow-sm hover:bg-gray-200 hover:scale-105 transition-all">
                    <h1 className="text-lg font-semibold">Netflix</h1>
                    <p className="text-gray-500 mt-2">Build a Netflix clone with FacOTTry</p>
                </Link>

                <Link target="_blank" href={`https://facottry-hotstar.vercel.app?projectID=${hotstarDemo?.projectID}`} className="bg-gray-100 p-4 rounded-md border shadow-sm hover:bg-gray-200 hover:scale-105 transition-all">
                    <h1 className="text-lg font-semibold">Hotstar</h1>
                    <p className="text-gray-500 mt-2">Build a Hotstar clone with FacOTTry</p>
                </Link>

                <Link target="_blank" href={`https://facottry-ecommerce.vercel.app?projectID=${apneckDemo?.projectID}`} className="bg-gray-100 p-4 rounded-md border shadow-sm hover:bg-gray-200 hover:scale-105 transition-all">
                    <h1 className="text-lg font-semibold">E-commerce</h1>
                    <p className="text-gray-500 mt-2">Build an e-commerce site with FacOTTry</p>
                </Link>
            </div>
        </div>
    )
}

export default SiteExamples