import { useEffect, useState } from "react";
import { phoneHelper } from "./helpers/phone-helper";
import axios from "axios";

interface ResponseObject {
  email: string;
  number: number;
}

export function App() {
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isValidationError, setIsValidationError] = useState<null | {
    email: string;
  }>();
  const [response, setResponse] = useState<null | any>(null);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    setIsValidationError(null);
  }, [email]);

  return (
    <div className="form">
      <form>
        <label htmlFor="e-mail" style={{ color: "white" }}>
          Email:
        </label>
        <input
          type="text"
          name="e-mail"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          id="e-mail"
        />
        <br />
        <div style={{ color: "red" }}>{isValidationError?.email}</div>
        <label htmlFor="number" style={{ color: "white" }}>
          Phone:
        </label>
        <input
          type="text"
          name="number"
          id="number"
          onChange={(e) => {
            const digitMach = /^[0-9]*$/;

            if (digitMach.test(e.target.value.split("-").join("")))
              setPhone(phoneHelper(e.target.value));
          }}
          value={phone}
        />
        <br />
        <button
          onClick={(e) => {
            e.preventDefault();
            setNoData(false);
            setResponse(null);

            const emailCheck =
              /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;

            if (!emailCheck.test(email)) {
              setIsValidationError({
                ...isValidationError,
                email: "Check email correctness",
              });
            } else {
              axios
                .post(
                  "http://localhost:3000/",
                  phone.length
                    ? { email, phone: phone.split("-").join("") }
                    : { email }
                )
                .then((res) => {
                  if (res.data === "Cancelled") return;
                  if (res.data === "No data found") {
                    setNoData(true);
                    setResponse(null);
                    return;
                  }
                  setResponse(res.data);
                })
                .catch(() => console.log("Oops error!"));
            }
          }}
        >
          Submit
        </button>
      </form>
      {response
        ? response.map((item: ResponseObject) => {
            return (
              <>
                <div key={item.number} style={{ color: "white" }}>
                  Email: {item.email}
                </div>
                <div key={item.number} style={{ color: "white" }}>
                  Phone: {item.number}
                </div>
              </>
            );
          })
        : "..."}
      <br />
      {noData ? "Oops no data found..." : null}
    </div>
  );
}
