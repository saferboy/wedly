Bu papkaga fon musiqasi fayllarini (mp3 / m4a) tashlang.

Har bir yangi qo'shiq uchun src/lib/songs.ts dagi SONGS ro'yxatiga
bitta yozuv qo'shing. Masalan:

  {
    id: "sokin-piano",
    title: "Sokin — Pianino",
    sub: "Nozik, romantik uslub",
    url: "/music/sokin-piano.mp3",
    events: ["WEDDING", "BACHELORETTE"], // ixtiyoriy
  }

`url` doim "/music/<fayl-nomi>" ko'rinishida bo'ladi.
`events` belgilanmasa — qo'shiq barcha tadbir turlariga chiqadi.
