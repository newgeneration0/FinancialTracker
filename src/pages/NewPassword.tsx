import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { Input } from '../../src/components/ui/input';
import { Label } from '../../src/components/ui/label';
import { Wallet } from 'lucide-react';

function NewPassword(
    // { onReset }: { onReset : (password: string) => void }
) {

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(password === confirm) {
            // onReset(password);
        }else {
            alert('password do not match')
        }
    }

  return (
    <div  className='min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-700'>
        <div className="w-full max-w-md space-y-8">
             {/* Logo and Header */}
            <div className="text-center">
                <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                    <Wallet className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:bg-gradient-to-r dark:from-gray-100 dark:to-gray-50 bg-clip-text text-transparent">
                    {/* FinanceTracker */}
                    WealthWise
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {/* Take control of your financial future */}
                    Protect your finances. Stay on track.
                </p>
            </div>
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900 backdrop-blur-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center text-gray-900 dark:text-gray-100">
                        Reset Password
                    </CardTitle>
                    <CardDescription className="text-center text-gray-900 dark:text-gray-400">
            
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="Enter Your New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm Your New Password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>
                        
                        <Button 
                            type="submit" 
                            className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-gray-100"
                            // disabled={isLoading}
                        >
                            Save New Password
                        </Button>
                    </form>
                </CardContent>
            </Card>
         </div>
    </div>
  )
}

export default NewPassword