import axios from "axios";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useRevalidator, useRouteLoaderData } from "react-router-dom";
import ErrorContainer from "./ErrorContainer";

export default function ProfilePage() {
    const revalidator = useRevalidator();

    const user = useRouteLoaderData("root");
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    async function updateProfile (event) {
        event.preventDefault();

        setIsLoading(true);

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        try {
            await axios.patch("/profile", data);

            revalidator.revalidate();
        } catch (error) {
            if (error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                setErrors([error.message]);
            }

            console.error(error);
        }
        setIsLoading(false);
    }

    return (
        <Container className="py-4">
            <h2 className="fs-3">Update Profile Details</h2>

            <ErrorContainer errors={errors} className={"container mt-1"} />

            <section className="col-6">
                <Form onSubmit={updateProfile}>
                    <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" autoComplete='off' placeholder="Enter full name" name="name" defaultValue={user.name} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" autoComplete='off' placeholder="Enter full name" name="email" defaultValue={user.email} required />
                    </Form.Group>

                    <Button type="submit" disabled={isLoading} variant="primary">
                        {isLoading ? "Saving..." : "Update Profile"}
                    </Button>

                </Form>
            </section>

        </Container>
    );
}