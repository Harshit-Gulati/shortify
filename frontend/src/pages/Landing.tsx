import { Link } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useRef, useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Landing = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [shortUrl, setShortUrl] = useState("");
  const [urlImg, setUrlImg] = useState("");
  const [err, setErr] = useState("");

  const isValid = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async () => {
    setErr("");
    try {
      if (inputRef.current?.value && isValid(inputRef.current.value)) {
        const res = await axios.post(`${BACKEND_URL}/api/shorten`, {
          originalUrl: inputRef.current?.value,
        });
        const newShortUrl = `${BACKEND_URL}/${res.data.urlHash}`;
        setShortUrl(newShortUrl);
        setUrlImg(res.data.qrCode);
      } else {
        setErr("Invalid link!");
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-[#09090B] h-screen w-screen flex flex-col items-center">
      <div className="w-screen flex justify-center">
        <nav className="w-screen lg:w-4/5 p-3 flex items-center justify-between fixed">
        <Link to="/">
          <span className="text-white font-bold text-2xl tracking-tighter hover:text-purple-400 transition-all">
            Shortify
          </span>
        </Link>
        <Link to="/stats" className={buttonVariants({ variant: "secondary" })}>
          Check Stats
        </Link>
      </nav></div>
      <div className="m-auto">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Shorten your link</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              ref={inputRef}
              type="url"
              placeholder="Enter long link here"
              className="bg-[#09090B] text-white"
            />
            {err !== "" && <span className="p-2 text-red-500">{err}</span>}
            {shortUrl !== "" && (
              <div className="flex flex-col">
                <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
                  <Input
                    value={shortUrl}
                    type="text"
                    readOnly
                    className="bg-[#09090B] text-white"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(shortUrl);
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <div className="flex justify-center mt-4">
                  <img src={urlImg} className="w-24" />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="default" className="w-full" onClick={handleSubmit}>
              Shorten
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
