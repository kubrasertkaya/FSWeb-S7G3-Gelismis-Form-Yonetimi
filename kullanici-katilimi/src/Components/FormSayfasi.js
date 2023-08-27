import React, { useEffect, useState } from "react";
import { Form, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import axios from "axios";
import * as Yup from "yup";

const FormSayfasi = () => {
  const [formDolumu, setformDolumu] = useState(false);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    check: false,
  });

  const [formErrors, setFormErrors] = useState({
    // Hata mesajlarının yazılacağı state'e ait prop'lar boş bir string ile başlamalı.
    name: "",
    surname: "",
    email: "",
    password: "",
    check: "",
  });

  const formSchema = Yup.object().shape({
    name: Yup.string()
      .required("Lütfen isminizi giriniz..")
      .min(2, "en az iki karakter içermelidir."),
    surname: Yup.string()
      .required("Lütfen soyadınızı giriniz..")
      .min(2, "en az iki karakter içermelidir."),
    password: Yup.string()
      .required("Lütfen şifrenizi giriniz..")
      .min(6, "en az altı karakter içermelidir."),
    email: Yup.string(),
    check: Yup.boolean().oneOf(
      [true],
      "Kullanıcı bilgilerinin paylaşılmasını onaylayın. "
    ),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("https://reqres.in/api/users", users).then((res) => {
      setUsers((users) => [...users, res.data]);
      axios
        .get("https://reqres.in/api/users")
        .then((res) => console.log(res.data));
    });
  };

  const HandleChange = (e) => {
    // destructuring tekniği:
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setForm({ ...form, [name]: val });
    // hata mesajını yup'tan alma:
    Yup.reach(formSchema, name)
      .validate(val)
      .then((valid) => {
        setFormErrors({ ...formErrors, [name]: " " });
      })
      .catch((err) => {
        setFormErrors({ ...formErrors, [name]: err.errors[0] });
      });
  };

  useEffect(() => {
    formSchema.isValid(form).then((valid) => {
      setformDolumu(valid);
    });
  }, [form, formSchema]);

  return (
    <div>
      <br />
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">
            <p>- Adı -</p>
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            onChange={HandleChange}
            value={form.name}
            invalid={!!formErrors.name}
          />
          {formErrors.name && <FormFeedback> {formErrors.name} </FormFeedback>}
        </FormGroup>

        <br />

        <FormGroup>
          <Label htmlFor="surname">
            <p>- Soyadı -</p>
          </Label>
          <Input
            id="surname"
            name="surname"
            type="text"
            onChange={HandleChange}
            value={form.surname}
            invalid={!!formErrors.surname}
          />
          {formErrors.surname && (
            <FormFeedback> {formErrors.surname} </FormFeedback>
          )}
        </FormGroup>

        <br />

        <FormGroup>
          <Label htmlFor="email">
            <p>- E-mail -</p>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            onChange={HandleChange}
            value={form.email}
            invalid={!!formErrors.email}
          />
          {formErrors.email && (
            <FormFeedback> {formErrors.email} </FormFeedback>
          )}
        </FormGroup>

        <br />

        <FormGroup>
          <Label htmlFor="password">
            <p>- Şifre -</p>
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            onChange={HandleChange}
            value={form.password}
            invalid={!!formErrors.password}
          />
          {formErrors.password && (
            <FormFeedback> {formErrors.password} </FormFeedback>
          )}
        </FormGroup>
        <br />

        <FormGroup>
          <Label htmlFor="check">
            Verdiğim Bilgilerin Paylaşılmasını Kabul Ediyorum :{" "}
          </Label>
          <Input
            id="check"
            name="check"
            type="checkbox"
            onChange={HandleChange}
            value={form.check}
            invalid={!!formErrors.check}
          />
          {formErrors.check && (
            <FormFeedback> {formErrors.check} </FormFeedback>
          )}
        </FormGroup>

        <br />

        <button type="submit" disabled={!formDolumu}>
          Gönder!
        </button>
      </Form>
    </div>
  );
};

export default FormSayfasi;
