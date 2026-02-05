import { RESTAURANT_INFO } from '../../utils/constants';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-3">{RESTAURANT_INFO.name}</h3>
            <p className="text-gray-400 text-sm">{RESTAURANT_INFO.location}</p>
            <p className="text-gray-400 text-sm mt-2">FSSAI: {RESTAURANT_INFO.fssaiLicense}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Hours</h4>
            <p className="text-gray-400 text-sm">Mon - Sun: 10:00 AM - 10:00 PM</p>
            <p className="text-gray-400 text-sm mt-1">Prep Time: {RESTAURANT_INFO.prepTime}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <p className="text-gray-400 text-sm">Phone: +91 98765 43210</p>
            <p className="text-gray-400 text-sm mt-1">Email: order@starchicken.com</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} {RESTAURANT_INFO.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
