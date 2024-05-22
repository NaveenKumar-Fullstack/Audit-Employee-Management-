import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "../base_url";

const AdminProfile = () => {
    const [profile, setProfile] = useState({});
    const { id } = useParams();

    useEffect(() => {
        axios.get(`${baseUrl}/auth/profile/${id}`)
            .then(result => {
                setProfile(result.data.Result);
            })
            .catch(err => console.error(err));
    }, [id]);

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title d-flex justify-content-center mb-4 p-2">Admin Profile</h4>
                    <hr />
                    <h3 className="mb-1">Email: {profile.email}</h3>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
