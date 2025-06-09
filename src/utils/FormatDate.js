

export default function (dateString){

    const date = new Date(dateString);

    // Format options
    const options = {
        weekday: "short",
        month: "short",
        day: "2-digit",
        year: "numeric"
    };

    // Format the date
    const formattedDate = date.toLocaleDateString("en-US", options);

    // Rearrange the formatted date
    const [weekday, month, day, year] = formattedDate.split(" ");

    return `${weekday} ${month} ${day} ${year}`;
}