
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Edit, Settings, Star, Package, History, Heart, Clock, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/hooks/use-auth";
import MockDataService from "@/services/mockDataService";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("listings");
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "Aditya Kumar",
    email: "aditya.kumar@university.edu",
    department: "Information Technology",
    year: "4th Year",
    avatar: "https://i.pravatar.cc/150?u=aditya",
    location: "North Campus Hostel",
    joinedDate: "August 2021",
    rating: 4.7,
    totalSales: 14,
    totalPurchases: 8,
    listedProducts: [],
    savedProducts: [],
    transactions: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  // Load user data and products
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Get products from mock data service
        const dataService = MockDataService.getInstance();
        const allProducts = await dataService.getProducts();
        
        // For demo, set first 2 products as user's listings
        const userListings = allProducts.slice(0, 2).map(product => ({
          ...product,
          seller: userData.name
        }));
        
        // Set another product as saved
        const savedProduct = allProducts.slice(2, 3);
        
        // Sample transactions data
        const sampleTransactions = [
          {
            id: "t1",
            type: "sold",
            item: "Physics Lab Manual",
            price: 200,
            buyer: "Rohit S.",
            date: "15 Apr 2023",
            status: "completed"
          },
          {
            id: "t2",
            type: "purchased",
            item: "Programming Fundamentals Textbook",
            price: 400,
            seller: "Neha P.",
            date: "28 Mar 2023",
            status: "completed"
          },
          {
            id: "t3",
            type: "sold",
            item: "USB Multimeter",
            price: 650,
            buyer: "Vikram J.",
            date: "10 Feb 2023",
            status: "completed"
          }
        ];
        
        // Update user data with products
        setUserData(prevData => ({
          ...prevData,
          listedProducts: userListings,
          savedProducts: savedProduct,
          transactions: sampleTransactions,
          // If user is logged in, use their info
          ...(user && {
            name: user.name || prevData.name,
            email: user.email || prevData.email,
            avatar: `https://i.pravatar.cc/150?u=${user.name?.replace(/\s+/g, '') || 'aditya'}`
          })
        }));
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-unimart-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div 
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <Avatar className="h-24 w-24 mb-4 md:mb-0 md:mr-6">
              <AvatarImage src={userData.avatar} />
              <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <h1 className="text-2xl font-bold mb-2 md:mb-0">{userData.name}</h1>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="h-9">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="ghost" size="sm" className="h-9">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-gray-600 mb-2">{userData.department}, {userData.year}</div>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span>{userData.rating} Rating</span>
                </div>
                <div>
                  {userData.totalSales} Sales
                </div>
                <div>
                  {userData.totalPurchases} Purchases
                </div>
                <div>
                  <Badge variant="outline">Verified Student</Badge>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-gray-500 mb-1">Email</div>
              <div>{userData.email}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Location</div>
              <div>{userData.location}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Member Since</div>
              <div>{userData.joinedDate}</div>
            </div>
          </div>
        </motion.div>
        
        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="listings" className="flex items-center">
              <Package className="h-4 w-4 mr-2" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Saved Items
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="h-4 w-4 mr-2" />
              Transaction History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="listings" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">My Listed Products</h2>
              <Button className="bg-unimart-600 hover:bg-unimart-700">
                Add New Listing
              </Button>
            </div>
            
            {userData.listedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userData.listedProducts.map(product => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="text-lg font-medium mb-2">No listings yet</h3>
                <p className="text-gray-500 mb-6">You haven't listed any products for sale yet.</p>
                <Button className="bg-unimart-600 hover:bg-unimart-700">
                  Create your first listing
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved" className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Saved Products</h2>
            
            {userData.savedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userData.savedProducts.map(product => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="text-5xl mb-4">❤️</div>
                <h3 className="text-lg font-medium mb-2">No saved items</h3>
                <p className="text-gray-500 mb-6">You haven't saved any products yet.</p>
                <Button variant="outline">
                  Browse products
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Transaction History</h2>
            
            {userData.transactions.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="divide-y">
                  {userData.transactions.map(transaction => (
                    <div key={transaction.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant={transaction.type === "sold" ? "default" : "secondary"} className="capitalize">
                            {transaction.type}
                          </Badge>
                          <div className="font-medium">{transaction.item}</div>
                        </div>
                        <div className="flex items-center">
                          <div className="font-medium mr-4">₹{transaction.price}</div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{transaction.date}</span>
                        <span className="mx-2">•</span>
                        <span>
                          {transaction.type === "sold" ? `Sold to ${transaction.buyer}` : `Purchased from ${transaction.seller}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-lg font-medium mb-2">No transaction history</h3>
                <p className="text-gray-500">You haven't made any transactions yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Profile;
