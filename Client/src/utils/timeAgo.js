export const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);

    const seconds = Math.floor(
        (now - past) / 1000
    );

    if (seconds < 60) {
        return "Just now";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes} ${
            minutes === 1 ? "minute" : "minutes"
        } ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} ${
            hours === 1 ? "hour" : "hours"
        } ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days} ${
            days === 1 ? "day" : "days"
        } ago`;
    }

    return past.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};