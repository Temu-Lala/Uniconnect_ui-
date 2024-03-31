'use client'

import React , { useState }  from 'react'

export default function Lectures() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Assuming selectedImage is a URL, hence string

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string); // Assuming reader.result is a URL, hence string
      };
      reader.readAsDataURL(file);
    }
  };

 
  return (
    <div className="bg-cream text-white min-h-screen font-sans leading-normal overflow-x-hidden lg:overflow-auto">
      <main className="flex-1 md:p-0 lg:pt-8 lg:px-8 md:ml-24 flex flex-col">
      <section className="bg-cream-lighter p-4 shadow">
      <div className="md:flex">
        <h2 className="md:w-1/3 uppercase tracking-wide text-sm sm:text-lg mb-6">Create Your Cv </h2>
      </div>
      <form method=' post'>
      <div className="flex flex-1 px-3 text-center">
      <div className="button w-36 h-36 border-2 hover:border-yellow-500 text-cream mx-auto relative cursor-pointer rounded-xl bg-transparent">
        <input
          className="opacity-0 w-36 h-36 absolute cursor-pointer text-black"
          type="file"
          name="profile"
          onChange={handleImageChange}
        />
        {selectedImage ? (
          <img className="w-36 h-36 object-cover rounded-xl" src={selectedImage} alt="Selected" />
        ) : (
          <span>profile</span>
        )}
      </div>
    </div>
        <div className=" md:flex mb-8">
      
          <div className="md:w-1/3">
            <legend className="uppercase tracking-wide text-sm">Contact </legend>
            <p className="text-xs font-light text-red">This entire section is required.</p>
            <div className="md:flex-1 mt-2 mb:mt-0 md:px-3">
            <div className="mb-4">
              <label className="block uppercase tracking-wide text-xs font-bold">Phone</label>
              <input className="w-full shadow-inner p-4 border-0 text-black" type="tel" name="phone" placeholder="+2519999999"/>
            </div>
            <div className="mb-4">
              <label className="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">URL (Portfolio,Linkedin )</label>
              <input className="w-full shadow-inner p-4 border-0 text-black" type="url" name="url" placeholder="https://linkedin.com"/>
            </div>
            <div className="mb-4">
              <label className="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">Email</label>
              <input className="w-full shadow-inner p-4 border-0 text-black" type="email" name="email" placeholder="uniconnect@gmail.com"/>
            </div>
          </div>
          </div>
        <div className="md:flex-1 mt-2 mb:mt-0 md:px-3">
          <div className="mb-4">
            <label className="block uppercase tracking-wide text-xs font-bold"> Full Name</label>
            <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="name" placeholder="Name"/>
          </div>
          <div className="md:flex mb-4">
            <div className="md:flex-1 md:pr-3">
              <label className="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">Department</label>
              <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="address_street" placeholder="Department"/>
            </div>
            <div className="md:flex-1 md:pl-3">
              <label className="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">Bio.</label>
              <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="address_number" placeholder="Bio"/>
              <span className="text-xs mb-4 font-thin">Please cheack </span>
            </div>
          </div>
          <div className="md:flex mb-4">
            <div className="md:flex-1 md:pr-3">
                <label className="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">Education </label>
                <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="lat" placeholder="Education"/>
              </div>
              <div className="md:flex-1 md:pl-3">
                <label className="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">Exprians </label>
                <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="lon" placeholder="Exprians"/>
              </div>
            </div>
          </div>
        </div>
      






        <div className=" md:flex mb-8">
      
          <div className="md:w-1/3">
            <legend className="uppercase tracking-wide text-sm">skils </legend>
            <p className="text-xs font-light text-red">This entire section is required.</p>
            <div className="md:flex-1 mt-2 mb:mt-0 md:px-3">
            <div className="mb-4">
              <label className="block uppercase tracking-wide text-xs font-bold">Skils</label>
              <input className="w-full shadow-inner p-4 border-0 text-black" type="tel" name="phone" placeholder="python"/>
            </div>
            <div className="mb-4">
              <input className="w-full shadow-inner p-4 border-0 text-black" type="url" name="url" placeholder="Java"/>
            </div>
            <div className="mb-4">
              <input className="w-full shadow-inner p-4 border-0 text-black" type="email" name="email" placeholder="c++,php,react"/>
            </div>
          </div>
          </div>
        <div className="md:flex-1 mt-2 mb:mt-0 md:px-3">
         
          <div className="md:flex mb-4">
            <div className="md:flex-1 md:pr-3">
              <label className="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">Department</label>
              <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="address_street" placeholder="Department"/>
            </div>
            <div className="md:flex-1 md:pl-3">
              <label className="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">Bio.</label>
              <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="address_number" placeholder="Bio"/>
              <span className="text-xs mb-4 font-thin">Please cheack </span>
            </div>
          </div>
          <div className="md:flex mb-4">
            <div className="md:flex-1 md:pr-3">
                <label className="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">Education </label>
                <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="lat" placeholder="Education"/>
              </div>
              <div className="md:flex-1 md:pl-3">
                <label className="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">Exprians </label>
                <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="lon" placeholder="Exprians"/>
              </div>
            </div>
          </div>
        </div>






        
          <div className="md:flex mb-6 border  border-t-1 border-b-0 border-x-0 border-cream-dark">
            <div className=" md:flex-1 px-3 text-center md:text-right">
              <input className="button text-cream-lighter text-white bg-brick hover:bg-brick-dark cursor-pointer w-32 h-12 rounded-xl border-white border hover:bg-slate-500 hover" type="submit" value="Submit Form "/>
            </div>
          </div>
        </form>
      </section>
      </main>
    </div>
  )
}
