export interface Notification {
    id: string,
    name: string,
    notification: string,
    time: string,
    imgPath: string,
    type: string
}
export const notificationData: Notification[] = [
    {
      id: "001",
      name: "Debre Berhan University",
      notification: "added a post you haven't seen",
      time: "1",
      imgPath: "/images/universities/dbu.jpg",
      type: "university"
    },
    {
      id: "002",
      name: "Addis Abeba University",
      notification: "shared a news from education minister.",
      time: "4",
      imgPath: "/images/universities/aau.jpg",
      type: "university"
    },
    {
      id: "003",
      name: "Temesgen",
      notification: "added a post you haven't seen",
      time: "5",
      imgPath: "/images/lectures/temesgen.jfif",
      type: "lecture"
    },
    {
      id: "004",
      name: "Hawassa University",
      notification: "added a post you haven't seen",
      time: "8",
      imgPath: "/images/universities/hawasa.jfif",
      type: "university"
    },
    {
      id: "005",
      name: "Haremaya University",
      notification: "added to their story.",
      time: "9",
      imgPath: "/images/universities/haramaya.jfif",
      type: "university"
    }
  ]