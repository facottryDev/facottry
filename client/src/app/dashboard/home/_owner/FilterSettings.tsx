'use client'
import FilterEditorComponent from "./FilterEditorComponent"

type Props = {}

const FilterSettings = (props: Props) => {

    return (
        <div className="">
            <section className="w-full border rounded-md mt-8">
                <h1 className="text-lg font-bold text-center my-4">Manage Filters</h1>
                <FilterEditorComponent />
            </section>
        </div>
    )
}

export default FilterSettings