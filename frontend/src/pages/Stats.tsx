import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
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

export const Stats = () => {
  const shortUrlRef = useRef<HTMLInputElement>(null);
  const [visits, setVisits] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");

  const isValid = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.href.startsWith("https://shortify-zohe.onrender.com");
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErr("");
    try {
      if (shortUrlRef.current?.value && isValid(shortUrlRef.current.value)) {
        const urlHash = shortUrlRef.current?.value.split(BACKEND_URL + "/")[1];
        const res = await axios.get(`${BACKEND_URL}/stats/${urlHash}`);
        setVisits(res.data.visits);
      } else {
        setErr("Invalid link!");
        return;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
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
          <Link to="/" className={buttonVariants({ variant: "secondary" })}>
            Shorten Link
          </Link>
        </nav>
      </div>
      <div className="m-auto">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Check Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              ref={shortUrlRef}
              type="url"
              placeholder="Enter short link here"
              className="bg-[#09090B] text-white"
            />
            {err !== "" && (
              <span
                className="p-2 
            flex justify-center w-full text-red-500"
              >
                {err}
              </span>
            )}
            {visits !== -1 && (
              <span className="text-xl w-full flex justify-center mt-4 font-semibold">
                Total Visits: {visits}
              </span>
            )}
          </CardContent>
          <CardFooter>
            {!isLoading && (
              <Button
                variant="default"
                className="w-full"
                onClick={handleSubmit}
              >
                Check Stats
              </Button>
            )}
            {isLoading && (
              <Button disabled className="w-full" variant="default">
                <Loader2 className="animate-spin" />
                Please wait
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
