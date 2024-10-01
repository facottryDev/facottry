import React from 'react'
import Modal from 'react-modal';

type Props = {
    children: React.ReactNode,
    onRequestClose: () => void,
    isOpen: boolean,
    label: string,
    style?: object
}

const ModalUI = ({ children, onRequestClose, isOpen, label, style }: Props) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel={label}
            style={style || {
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.75)'
                },
                content: {
                    width: '50%',
                    height: 'fit-content',
                    margin: 'auto',
                    padding: '2rem',
                    borderRadius: '10px',
                    backgroundColor: 'white'
                }
            }}
        >
            {children}
        </Modal>
    )
}

export default ModalUI