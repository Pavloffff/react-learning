import React from "react";
import {useState, useEffect} from "react";

export const FrontToBack = () => {
    const [initialState, setInitialState] = useState({"title": "wegweg"})
    const body = {initialState}
    const response = fetch("/posts", {
            method: "GET",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(body)
        })
        console.log(response)
    return(<div>{setInitialState}</div>)
}