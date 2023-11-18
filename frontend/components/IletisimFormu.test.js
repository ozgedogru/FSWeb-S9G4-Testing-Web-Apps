import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  getByTestId,
  queryByTestId,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import IletisimFormu from "./IletisimFormu";
import Goruntule from "./Goruntule";

test("hata olmadan render ediliyor", () => {
  render(<IletisimFormu />);
});

beforeEach(() => {
  render(<IletisimFormu />);
});

test("iletişim formu headerı render ediliyor", () => {
  const headerElement = screen.getByText("İletişim Formu");
  expect(headerElement).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  const kullaniciAdi = screen.getByLabelText("Ad*");
  fireEvent.change(kullaniciAdi, { target: { value: "ozge" } });

  await waitFor(() => {
    const errorAd = screen.getByTestId("error-ad");
    expect(errorAd).toBeInTheDocument();
    expect(errorAd).toHaveTextContent("ad en az 5 karakter olmalıdır.");
  });
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  const submitButton = screen.getByText("Gönder");
  fireEvent.click(submitButton);

  await waitFor(() => {
    const errorAd = screen.getByTestId("error-ad");
    expect(errorAd).toBeInTheDocument();

    const errorSoyad = screen.getByTestId("error-soyad");
    expect(errorSoyad).toBeInTheDocument();

    const errorMail = screen.getByTestId("error-mail");
    expect(errorMail).toBeInTheDocument();
  });
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  const kullaniciAdi = screen.getByLabelText("Ad*");
  fireEvent.change(kullaniciAdi, { target: { value: "ozgen" } });

  const kullaniciSoyadi = screen.getByLabelText("Soyad*");
  fireEvent.change(kullaniciSoyadi, { target: { value: "dogru" } });

  const submitButton = screen.getByText("Gönder");
  fireEvent.click(submitButton);

  await waitFor(() => {
    const errorMail = screen.getByTestId("error-mail");
    expect(errorMail).toBeInTheDocument();
    expect(errorMail).toHaveTextContent(
      "email geçerli bir email adresi olmalıdır."
    );
  });
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  const kullaniciMail = screen.getByLabelText("Email*");
  fireEvent.change(kullaniciMail, { target: { value: "abcde" } });

  await waitFor(() => {
    const errorMail = screen.getByTestId("error-mail");
    expect(errorMail).toBeInTheDocument();
    expect(errorMail).toHaveTextContent(
      "email geçerli bir email adresi olmalıdır."
    );
  });
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  const submitButton = screen.getByText("Gönder");
  fireEvent.click(submitButton);

  await waitFor(() => {
    const errorSoyad = screen.queryByTestId("error-soyad");
    expect(errorSoyad).toBeInTheDocument();
    expect(errorSoyad).toHaveTextContent("soyad gereklidir.");
  });
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  const kullaniciAdi = screen.getByLabelText("Ad*");
  fireEvent.change(kullaniciAdi, { target: { value: "ozgen" } });

  const kullaniciSoyadi = screen.getByLabelText("Soyad*");
  fireEvent.change(kullaniciSoyadi, { target: { value: "dogru" } });

  const kullaniciMail = screen.getByLabelText("Email*");
  fireEvent.change(kullaniciMail, { target: { value: "example@example.com" } });

  const submitButton = screen.getByText("Gönder");
  fireEvent.click(submitButton);

  await waitFor(() => {
    const errorAd = screen.queryByTestId("error-ad");
    expect(errorAd).toBeNull();

    const errorSoyad = screen.queryByTestId("error-soyad");
    expect(errorSoyad).toBeNull();

    const errorMail = screen.queryByTestId("error-mail");
    expect(errorMail).toBeNull();
  });
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(
    <Goruntule
      form={{
        ad: "ozgen",
        soyad: "dogru",
        email: "example@example.com",
        mesaj: "Hello",
      }}
    />
  );

  await waitFor(() => {
    const ad = screen.getByTestId("firstnameDisplay");
    const soyad = screen.getByTestId("lastnameDisplay");
    const mail = screen.getByTestId("emailDisplay");
    const mesaj = screen.getByTestId("messageDisplay");

    expect(ad).toBeInTheDocument();
    expect(ad).toHaveTextContent("ozgen");

    expect(soyad).toBeInTheDocument();
    expect(soyad).toHaveTextContent("dogru");

    expect(mail).toBeInTheDocument();
    expect(mail).toHaveTextContent("example@example.com");

    expect(mesaj).toBeInTheDocument();
    expect(mesaj).toHaveTextContent("Hello");
  });
});
