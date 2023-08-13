import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Accordion, Badge, Button, Card } from "react-bootstrap";
import Loading from "../Loading/Loading";
import ErrorMessage from "../ErrorMessage.js/ErrorMessage";
import { Link, useHistory } from "react-router-dom";
import MainScreen from "../MainScreen";
import { deleteNoteAction, listNotes } from "../../actions/notesActions";

const MyNotes = ({ search }) => {
  const dispatch = useDispatch();
  const noteList = useSelector((state) => state.noteList);
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const noteCreate = useSelector((state) => state.noteCreate);
  const noteUpdate = useSelector((state) => state.noteUpdate);
  const noteDelete = useSelector((state) => state.noteDelete);
  const { success: successCreate } = noteCreate;
  const { success: successUpdate } = noteUpdate;
  const { loading, notes, error } = noteList;
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = noteDelete;
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(listNotes());
    if (!userInfo) {
      history.push("/");
    }
  }, [
    dispatch,
    successCreate,
    successUpdate,
    successDelete,
    history,
    userInfo,
  ]);
  //So if note is created , updated , or deleted useeffect would get called and all notes would be again fetched from database and reloaded. Also rerender will have since state will change.

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteNoteAction(id));
    }
  };
  return (
    <MainScreen title={`Welcome back ${userInfo.name}...`}>
      <Link to="createnote">
        <Button style={{ margin: 10, marginBottom: 10 }} size="lg">
          Create new Note
        </Button>
      </Link>
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {errorDelete && (
        <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>
      )}
      {loadingDelete && <Loading />}
      {loading && <Loading size="50" />}
      {notes
        ?.reverse()
        .filter((filteredNote) =>
          filteredNote.title.toLowerCase().includes(search.toLowerCase())
        )
        .map((note) => (
          <Accordion defaultActiveKey={["0"]} flush>
            <Accordion.Item eventkey="0">
              <Card style={{ margin: 10 }}>
                <Accordion.Header style={{ display: "flex" }}>
                  <span
                    style={{
                      color: "black",
                      textDecoration: "none",
                      flex: 1,
                      cursor: "pointer",
                      alignSelf: "center",
                      fontSize: 18,
                    }}
                  >
                    <Accordion.Button as={Card.Text} variant="link">
                      {note.title}
                    </Accordion.Button>
                  </span>
                  <div>
                    <Button href={`/note/${note._id}`}>Edit</Button>
                    <Button
                      variant="danger"
                      className="mx-2"
                      onClick={() => deleteHandler(note._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Accordion.Header>
                <Accordion.Collapse eventkey="0">
                  <Card.Body>
                    <Badge pill bg="success">
                      Category - {note.category}
                    </Badge>
                    <img src={note.pic} alt="Unable to Load Pic" style={{ width: '200px', height: '150px',paddingLeft: '20px' }} />
                    <blockquote className="blockquote mb-0">
                      <p>{note.content}</p>
                      <footer className="blockquote-footer">
                        Created on{" "}
                        <cite title="Source Title">
                          {note.createdAt.substring(0, 10)};
                        </cite>
                      </footer>
                    </blockquote>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion.Item>
          </Accordion>
        ))}
    </MainScreen>
  );
};

export default MyNotes;
