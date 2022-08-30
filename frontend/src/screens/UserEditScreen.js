import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { getUserDetails, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";

function UserEditScreen() {
  const userId = useParams().id;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [is_admin, setAdmin] = useState(false);

  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = userUpdate;

  //retrieve in caso di errore
  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      navigate("/admin/listautenti");
    } else {
      if (!user.name || user.id !== Number(userId)) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setAdmin(user.is_admin);
      }
    }
  }, [user, userId, successUpdate, navigate, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ id: user.id, name, email, is_admin }));
  };

  return (
    <div>
      <Link to="/admin/listautenti">Indietro</Link>

      <FormContainer>
        <h1>Modifica Utente</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="name"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="isadmin">
              <Form.Check
                type="checkbox"
                label="Admin"
                checked={is_admin}
                onChange={(e) => setAdmin(e.target.checked)}
              ></Form.Check>{" "}
            </Form.Group>

            <Button type="submit" variant="primary">
              Aggiorna
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
}

export default UserEditScreen;
