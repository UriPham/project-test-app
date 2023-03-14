import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { FcPlus } from 'react-icons/fc'
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { postCreateUser } from '../../../services/apiService';
import _ from 'lodash'


const ModalUpdateUser = (props) => {
    const { show, setShow, dataUpdate } = props
    const handleClose = () => {
        setShow(false)
        setEmail('')
        setPassword('')
        setUserName('')
        setRole('USER')
        setImage('')
        setPreviewImage('')
    };

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [userName, setUserName] = useState("")
    const [role, setRole] = useState("USER")
    const [image, setImage] = useState("")
    const [previewImage, setPreviewImage] = useState("")

    useEffect(() => {
        if (!_.isEmpty(dataUpdate)) {
            setEmail(dataUpdate.email)
            setUserName(dataUpdate.username)
            setRole(dataUpdate.role)
            setImage('')
            if (dataUpdate.image) {
                setPreviewImage(`data:image/png;base64,${dataUpdate.image}`)
            }
        }
    }, [dataUpdate])

    const handleUploadImage = (e) => {
        if (e.target && e.target.files && e.target.files[0]) {
            setPreviewImage(URL.createObjectURL(e.target.files[0]))
            setImage(e.target.files[0])
        } else {
            // setPreviewImage(null)
        }
    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmitCreateUser = async () => {
        //validate
        const isValidEmail = validateEmail(email)
        if (!isValidEmail) {
            toast.error('Invalid email')
            return;
        }
        if (!password) {
            toast.error('Invalid password')
            return;
        }

        let data = await postCreateUser(email, password, userName, role, image)
        console.log('>>>check: ', data);
        if (data && data.EC === 0) {
            toast.success(data.EM)
            handleClose()
            await props.fetchListUsers()
        }

        if (data && data.EC !== 0) {
            toast.error(data.EM)
        }
    }

    return (
        <>
            {/* <Button variant="primary" onClick={handleShow}>
                Launch demo modal
            </Button> */}

            <Modal
                show={show}
                onHide={handleClose}
                size="xl"
                backdrop='static'
                className='modal-add-user'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update a user</Modal.Title>
                </Modal.Header>
                <Modal.Body><form className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            disabled
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            disabled
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">UserName</label>
                        <input
                            type="text"
                            className="form-control"
                            value={userName}
                            onChange={e => setUserName(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Role</label>
                        <select
                            className="form-select"
                            onChange={e => setRole(e.target.value)}
                            value={role}
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
                    <div className='col-md-12'>
                        <label className="form-label label-upload" htmlFor='labelUpload'>
                            <FcPlus />
                            Upload file Image
                        </label>
                        <input
                            type='file'
                            hidden
                            id="labelUpload"
                            onChange={e => handleUploadImage(e)}
                        />
                    </div>
                    <div className='col-md-12 img-preview'>
                        {previewImage
                            ?
                            <img src={previewImage} />
                            :
                            <span>Preview image</span>
                        }

                    </div>
                </form></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleSubmitCreateUser()}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalUpdateUser
