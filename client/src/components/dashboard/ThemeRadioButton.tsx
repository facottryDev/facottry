'use client'
import { RadioGroup } from '@headlessui/react'
import Image from 'next/image'
import { FiTrash } from "react-icons/fi"
import { axios_config } from "@/lib/axios"
import { fetchConfigs } from "@/lib/fetch"
import { userStore } from "@/lib/store"
import { IoPencilSharp } from "react-icons/io5"
import { useState } from "react"
import Modal from 'react-modal';

type Props = {
    options: any[],
    onThemeChange: (theme: any) => void,
    theme: any,
    getConfigs: () => void,
    userRole: string,
}

export default function ConfigButton({ userRole, getConfigs, options, theme, onThemeChange }: Props) {
    const activeProject = userStore(state => state.activeProject);
    const activeProjectID = activeProject?.projectID;
    const [EditConfigModal, setEditConfigModal] = useState("");

    const handleDelete = async (configID: string) => {
        try {
            await axios_config.delete(`/delete?configID=${configID}`);
            alert("Config deleted successfully");
            fetchConfigs(activeProjectID);
            getConfigs();
            setEditConfigModal("");
        } catch (error) {
            console.log(error)
        }
    }

    const handleEdit = async (e: any) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const configID = formData.get('configID');
        const name = formData.get('ConfigName');
        const desc = formData.get('ConfigDesc');
        const params = formData.get('ConfigParams') as string;

        try {
            JSON.parse(params);
        } catch (error) {
            alert('Invalid JSON format for Params');
            return;
        }

        try {
            await axios_config.post(`/update`, {
                configID,
                name,
                desc,
                params: JSON.parse(params)
            });
            alert("Config updated successfully");
            fetchConfigs(activeProjectID);
            getConfigs();
            setEditConfigModal("");
        } catch (error: any) {
            console.log(error);
            alert(error.response.data.message);
        }
    }

    const handleClone = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const form = e.currentTarget.form;

        if (form) {
            const formData = new FormData(form);

            const configID = formData.get('configID');
            const name = formData.get('ConfigName');
            const desc = formData.get('ConfigDesc');
            const params = formData.get('ConfigParams') as string;

            try {
                JSON.parse(params);
            } catch (error) {
                alert('Invalid JSON format for Params');
                return;
            }

            try {
                await axios_config.post(`/clone`, {
                    configID,
                    name,
                    desc,
                    params: JSON.parse(params)
                });
                alert("Config cloned successfully");
                fetchConfigs(activeProjectID);
                getConfigs();
                setEditConfigModal("");
            } catch (error: any) {
                console.log(error);
                alert(error.response.data.message);
            }
        }
    }

    return (
        <div className="w-fit max-w-xl m-auto">
            <div className="mx-auto w-full">
                <RadioGroup value={theme} onChange={onThemeChange}>
                    <RadioGroup.Label className="sr-only">Themes</RadioGroup.Label>
                    <div className="lg:grid grid-cols-2 lg:gap-4">
                        {options.map((option, index) => (
                            <div key={index}>
                                <Modal
                                    isOpen={EditConfigModal === option.configID}
                                    onRequestClose={() => setEditConfigModal("")}
                                    contentLabel="Edit Config Modal"
                                    style={
                                        {
                                            overlay: {
                                                backgroundColor: 'rgba(0, 0, 0, 0.75)'
                                            },
                                            content: {
                                                width: 'max-content',
                                                height: 'max-content',
                                                maxHeight: '80%',
                                                margin: 'auto',
                                                padding: '2rem',
                                                borderRadius: '10px',
                                                backgroundColor: 'white'
                                            }
                                        }
                                    }
                                >
                                    <div className="flex flex-col items-center justify-center bg-white">
                                        <h1 className="font-bold text-lg">Edit Config</h1>

                                        <form className="flex flex-col w-[50vw] max-w-sm bg-white" onSubmit={handleEdit}>
                                            <input type="hidden" name="configID" value={option.configID} />

                                            <label htmlFor="ConfigName" className="mt-4">Name *</label>
                                            <input id="ConfigName" name="ConfigName" type="text" className="w-full p-2 border rounded-md" defaultValue={option.name} onKeyDown={(e) => e.stopPropagation()} />

                                            <label htmlFor="ConfigDesc" className="mt-2">Description</label>
                                            <input type="text" id="ConfigDesc" name="ConfigDesc" className="w-full p-2 border rounded-md" defaultValue={option.desc} onKeyDown={(e) => e.stopPropagation()} />

                                            <label htmlFor="ConfigParams" className="mt-2">Params (JSON)*</label>
                                            <textarea id="ConfigParams" name="ConfigParams" className="w-full p-2 border rounded-md" rows={4} defaultValue={
                                                JSON.stringify(option.params, null, 2)
                                            } onKeyDown={(e) => e.stopPropagation()} />

                                            <button type="submit" className="mt-4 px-4 py-2 text-white bg-primary rounded-md hover:bg-primary600"
                                            >Save</button>

                                            <button type="button" className="w-full mt-4 px-4 py-2 text-white bg-primary rounded-md hover:bg-primary00" onClick={handleClone}>Save As New Configs</button>
                                        </form>

                                        <button className="mt-4 px-4 text-red-500 hover:underline font-semibold" onClick={
                                            () => {
                                                handleDelete(option.configID);
                                            }
                                        }>Delete Config</button>
                                    </div>
                                </Modal>

                                <RadioGroup.Option
                                    key={option.name}
                                    value={option}
                                    className={({ active, checked }) =>
                                        `${active
                                            ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                                            : ''
                                        }
                  ${checked ? 'bg-primary600 dark:bg-primary800 text-white' : 'bg-white dark:bg-darkblue border rounded-lg'}
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none mb-4 `
                                    }
                                >
                                    {({ active, checked }) => (
                                        <>
                                            <div className="flex flex-col justify-center w-full">
                                                <div className="flex w-full items-center justify-between">
                                                    <div className="flex w-full justify-between items-center px-2">
                                                        <div className="text-sm">
                                                            <RadioGroup.Label
                                                                as="p"
                                                                className={`font-bold text-lg ${checked ? 'text-white' : 'text-gray-900'} dark:text-white`}
                                                            >
                                                                {option.name}
                                                            </RadioGroup.Label>
                                                            <RadioGroup.Description
                                                                as="span"
                                                                className={`inline ${checked ? 'text-sky-100 dark:text-slate-200' : 'text-gray-500'
                                                                    } `}
                                                            >
                                                                {option.desc}
                                                            </RadioGroup.Description>
                                                            {checked && (
                                                                <div className="text-xs text-white bg-primary600 dark:bg-primary800 rounded-full ">
                                                                    {JSON.stringify(option.params, null, 2)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {userRole && (userRole === 'editor' || userRole === 'owner') && (
                                                            <button className="ml-2 p-2 rounded-full bg-primary400 text-white hover:bg-primary transition-all" onClick={
                                                                () => {
                                                                    setEditConfigModal(option.configID)
                                                                }
                                                            }>
                                                                <IoPencilSharp />
                                                            </button>
                                                        )}
                                                    </div>
                                                    {checked && (
                                                        <div className="shrink-0 text-white">
                                                            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                                                                <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
                                                                <path
                                                                    d="M7 13l3 3 7-7"
                                                                    stroke="#fff"
                                                                    strokeWidth={1.5}
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>

                                                <Image src={option.demo_url} alt="user" width={1000} height={1000} className="mt-2 rounded-xl" />
                                            </div>
                                        </>
                                    )}
                                </RadioGroup.Option>
                            </div>
                        ))}
                    </div>
                </RadioGroup>
            </div>
        </div>
    )
}