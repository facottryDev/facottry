'use client'
import ConfigTypeComponent from "./ConfigTypeComponent"
import FilterEditorComponent from "./ManageFilter"

type Props = {}

const ManageConfigTypes = (props: Props) => {

    return (
        <div className="">
            <section className="w-full border rounded-md mt-8">
                <h1 className="text-lg font-bold text-center my-4">Manage Config Types</h1>
                <ConfigTypeComponent />
            </section>
        </div>
    )
}

export default ManageConfigTypes