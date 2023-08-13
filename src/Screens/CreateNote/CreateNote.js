import React, { useEffect, useState } from "react";
import MainScreen from "../../components/MainScreen";
import { Button, Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createNoteAction } from "../../actions/notesActions";
import Loading from "../../components/Loading/Loading";
import ErrorMessage from "../../components/ErrorMessage.js/ErrorMessage";
import ReactMarkdown from "react-markdown";
import { BlobServiceClient } from "@azure/storage-blob";
const storageAccountConnectionString = 'https://multifile624paid.blob.core.windows.net/note';
const containerName = 'note';
function CreateNote({ history }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [pic, setPic] = useState(
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  );
  const [picMessage, setPicMessage] = useState(null);

  const dispatch = useDispatch();

  const noteCreate = useSelector((state) => state.noteCreate);
  const { loading, error, note } = noteCreate;

  console.log(note);

  const resetHandler = () => {
    setTitle("");
    setCategory("");
    setContent("");
  };

  async function uploadImage(file) {
    console.log(file);
    console.log("Inside Upload Image");
    var connectionString = "https://multifile624paid.blob.core.windows.net/note?sp=racwdli&st=2023-08-12T13:19:07Z&se=2023-09-29T21:19:07Z&sip=0.0.0.0&sv=2022-11-02&sr=c&sig=SCmzOFd%2F0rwJUO97dY0AXkNpOBacrTTjCgKhe4iW%2BRo%3D";
    var blobServiceClient = new BlobServiceClient(connectionString);
    try {
      var containerName = "note";
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const blobClient = containerClient.getBlobClient(file.name);
      const blockBlobClient = blobClient.getBlockBlobClient();
      const result = await blockBlobClient.uploadData(file, {
        blockSize: 4 * 1024 * 1024,
        concurrency: 20,
        onProgress: ev => console.log(ev)
      });
      console.log("Uploaded File");
    }
    catch (error) {
      console.log("This is error while uploading file: ", error);
    }

  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createNoteAction(title, content, category, pic));
    if (!title || !content || !category || !pic) return;

    resetHandler();
    history.push("/mynotes");
  };
  const postDetails = (pics) => {
    if (!pics) {
      return setPicMessage("Please Select an Image");
    }
    setPicMessage(null);
    uploadImage(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {


      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "notezipper");
      data.append("cloud_name", "dbfmpczg0");
      fetch("https://api.cloudinary.com/v1_1/dbfmpczg0/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setPic(data.url.toString());
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return setPicMessage("Please Select an Image");
    }
  };

  useEffect(() => { }, []);

  return (
    <MainScreen title="Create a Note">
      <Card>
        <Card.Header>Create a new Note</Card.Header>
        <Card.Body>
          <Form onSubmit={submitHandler}>
            {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="title"
                value={title}
                placeholder="Enter the title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="content">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                value={content}
                placeholder="Enter the content"
                rows={4}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>
            {content && (
              <Card>
                <Card.Header>Note Preview</Card.Header>
                <Card.Body>
                  <ReactMarkdown>{content}</ReactMarkdown>
                </Card.Body>
              </Card>
            )}

            <Form.Group controlId="content">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="content"
                value={category}
                placeholder="Enter the Category"
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="pic">
              <Form.Label>Picture Of Note</Form.Label>
              <Form.Control
                onChange={(e) => postDetails(e.target.files[0])}
                id="custom-file"
                type="file"
                label="Upload Profile Picture"
                placeholder="Confirm Password"
                accept="image/*"
              />
            </Form.Group>
            {loading && <Loading size={50} />}
            <Button type="submit" variant="primary">
              Create Note
            </Button>
            <Button className="mx-2" onClick={resetHandler} variant="danger">
              Reset Feilds
            </Button>
          </Form>
        </Card.Body>

        <Card.Footer className="text-muted">
          Creating on - {new Date().toLocaleDateString()}
        </Card.Footer>
      </Card>
    </MainScreen>
  );
}

export default CreateNote;