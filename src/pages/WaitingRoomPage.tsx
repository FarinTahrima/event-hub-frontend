import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card";
import { Gamepad2, Dices, Grid3X3, Calculator, Clock } from 'lucide-react';
import Pong from '../components/Pong';
import Checkers from '../components/Checkers';
import Tetris from '../components/Tetris';
import Game2048 from '../components/2048';

const WaitingRoomPage: React.FC = () => {
  const eventDateTime = new Date('2024-10-30T14:00:00');
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = eventDateTime.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft('Event has started!');
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 text-white">
      <div className="container mx-auto p-8">
        <div className="text-center mb-8 p-6 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Event Waiting Room
          </h1>
          <div className="flex items-center justify-center space-x-2 text-2xl text-blue-400">
            <Clock className="w-6 h-6" />
            <span>Time until event: {timeLeft}</span>
          </div>
          <p className="mt-2 text-gray-300">
            Event starts: {eventDateTime.toLocaleString()}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Play some games while you wait!
          </h2>
          <Tabs defaultValue="pong" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="pong" className="text-lg flex items-center justify-center">
                <Grid3X3 className="mr-2" /> Pong
              </TabsTrigger>
              <TabsTrigger value="checkers" className="text-lg flex items-center justify-center">
                <Gamepad2 className="mr-2" /> Checkers
              </TabsTrigger>
              <TabsTrigger value="tetris" className="text-lg flex items-center justify-center">
                <Dices className="mr-2" /> Tetris
              </TabsTrigger>
              <TabsTrigger value="2048" className="text-lg flex items-center justify-center">
                <Calculator className="mr-2" /> 2048
              </TabsTrigger>
            </TabsList>

            <div className="game-content bg-gray-800 p-6 rounded-lg shadow-lg">
              <TabsContent value="pong">
                <Card>
                  <CardHeader>
                    <CardTitle>2 Player Pong</CardTitle>
                    <CardDescription>Classic 1 vs 1 game. Beat your opponent</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Pong />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="checkers">
                <Card>
                  <CardHeader>
                    <CardTitle>Checkers</CardTitle>
                    <CardDescription>Strategic board game for two players.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Checkers />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tetris">
                <Card>
                  <CardHeader>
                    <CardTitle>Tetris</CardTitle>
                    <CardDescription>Arrange falling blocks to clear lines!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tetris />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="2048">
                <Card>
                  <CardHeader>
                    <CardTitle>2048</CardTitle>
                    <CardDescription>Merge tiles to reach 2048!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Game2048 />
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomPage;