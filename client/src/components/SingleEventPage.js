import React from 'react';
import axios from 'axios';
import { Link, useLoaderData } from 'react-router-dom';
import PageHeader from './PageHeader';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { dateFormatter } from '../utils';
import { PurchaseTicketForm } from './PurchaseTicketForm';

export async function loader({ params }) {
  const eventId = params.event_id;

  if (!eventId) {
    return null;
  }

  try {
    const response = await axios.get(`events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(error);

    if (error.response?.status === 404) {
      return null;
    }

    throw new Error(error.message);
  }
}

const SingleEventPage = () => {
  const event = useLoaderData();

  if (!event) {
    return <>
      <p>No such event exists</p>
      <p>Go back to the <Link to={"/events"}>events list.</Link></p>
    </>
  }

  return (
    <>
      <PageHeader title={event.title} actions={<>
        <Button as={Link} variant="link" to={"/events"}>Back to event gallery</Button>
      </>} />
      <Container className="mt-3 pb-5" fluid="lg">
        <Row className='gy-4'>
          <Col md={5}>
            <Card>
              <Card.Body>
                <Card.Text className="text-muted">
                  <span>{dateFormatter.format(new Date(event.start_date))}</span> {" - "} <span>{dateFormatter.format(new Date(event.end_date))}</span> <br />
                  {event.location}
                </Card.Text>
                <Card.Text>
                  {event.description}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <Card.Text>Organized by: {event.organizer.name}</Card.Text>
              </Card.Footer>
            </Card>
          </Col>

          <Col sm={12} md={7}>
            <PurchaseTicketForm event={event}/>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SingleEventPage;
