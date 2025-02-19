import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const explainCronParts = (cronString: string) => {
    const parts = cronString.split(' ');
    if (parts.length !== 6) return 'Invalid cron expression';

    const [minute, hour, dayOfMonth, month, dayOfWeek, year] = parts;

    const explanations: string[] = [];

    // Minute
    if (minute === '*') {
    explanations.push('every minute');
    } else if (minute.includes('/')) {
    const [, interval] = minute.split('/');
    explanations.push(`every ${interval} minutes`);
    } else {
    explanations.push(`at minute ${minute}`);
    }

    // Hour
    if (hour === '*') {
    explanations.push('of every hour');
    } else if (hour.includes('/')) {
    const [, interval] = hour.split('/');
    explanations.push(`every ${interval} hours`);
    } else {
    explanations.push(`at ${hour}:00`);
    }

    // Day of Month and Day of Week
    if (dayOfMonth === '?' && dayOfWeek !== '?') {
    if (dayOfWeek === '*') {
        explanations.push('on every day of the week');
    } else if (dayOfWeek.includes('-')) {
        const [start, end] = dayOfWeek.split('-');
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        explanations.push(`from ${days[parseInt(start)]} through ${days[parseInt(end)]}`);
    } else {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        explanations.push(`on ${days[parseInt(dayOfWeek)]}`);
    }
    } else if (dayOfMonth !== '?' && dayOfWeek === '?') {
    if (dayOfMonth === '*') {
        explanations.push('on every day of the month');
    } else {
        explanations.push(`on day ${dayOfMonth} of the month`);
    }
    }

    // Month
    if (month !== '*') {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (month.includes('-')) {
        const [start, end] = month.split('-');
        explanations.push(`from ${months[parseInt(start)-1]} through ${months[parseInt(end)-1]}`);
    } else {
        explanations.push(`in ${months[parseInt(month)-1]}`);
    }
    }

    // Year
    if (year !== '*') {
    explanations.push(`in year ${year}`);
    }

    return explanations.join(' ');
};


export const CronBuilder = ({ value, onChange, isEditing }: { value: string, onChange: (value: string) => void, isEditing: boolean }) => {
  const [activeTab, setActiveTab] = useState('simple');
  const [cronParts, setCronParts] = useState({
    minute: '0',
    hour: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '?',
    year: '*'
  });
  const [error, setError] = useState('');
  console.log("editing", isEditing);

  const commonSchedules = [
    { label: 'Every hour', value: '0 * * * ? *' },
    { label: 'Every day at midnight', value: '0 0 * * ? *' },
    { label: 'Every Monday', value: '0 0 ? * 1 *' },
    { label: 'Every weekday', value: '0 0 ? * 1-5 *' },
    { label: 'Every month', value: '0 0 1 * ? *' }
  ];

  useEffect(() => {
    if (value) {
      const parts = value.split(' ');
      if (parts.length === 6) {
        setCronParts({
          minute: parts[0],
          hour: parts[1],
          dayOfMonth: parts[2],
          month: parts[3],
          dayOfWeek: parts[4],
          year: parts[5]
        });
      }
      onChange(value);
    }
  }, [value]);

  useEffect(() => {
    console.log("cronParts", cronParts);
  }, [cronParts]);

  const validateCronPart = (part: string, type: keyof typeof cronParts) => {
    // Remove any spaces
    part = part.trim();
    
    // Allow * and */number
    if (part === '*' || /^\*\/\d+$/.test(part)) return '';
    
    // Allow comma-separated lists and ranges
    const values = part.split(',');
    
    for (const val of values) {
      if (val.includes('-')) {
        const [start, end] = val.split('-').map(Number);
        
        switch (type) {
          case 'minute':
            if (isNaN(start) || isNaN(end) || start < 0 || end > 59 || start > end)
              return 'Minutes must be between 0-59';
            break;
          case 'hour':
            if (isNaN(start) || isNaN(end) || start < 0 || end > 23 || start > end)
              return 'Hours must be between 0-23';
            break;
          case 'dayOfMonth':
            if ((start.toString() != "?") && (isNaN(start) || isNaN(end) || start < 1 || end > 31 || start > end))
              return 'Days must be between 1-31';
            break;
          case 'month':
            if (isNaN(start) || isNaN(end) || start < 1 || end > 12 || start > end)
              return 'Months must be between 1-12';
            break;
          case 'dayOfWeek':
            if ((start.toString() != "?") && (isNaN(start) || isNaN(end) || start < 0 || end > 6 || start > end))
              return 'Days of week must be between 0-6';
            break;
        }
      } else {
        const num = Number(val);
        
        switch (type) {
          case 'minute':
            if (isNaN(num) || num < 0 || num > 59)
              return 'Minutes must be between 0-59';
            else if (num.toString() == "*") {
                return 'Minutes can\'t be * on AWS. Use 0-59 instead.';
            }
            break;
          case 'hour':
            if (isNaN(num) || num < 0 || num > 23)
              return 'Hours must be between 0-23';
            break;
          case 'dayOfMonth':
            if (num.toString() != "?") break;
            if ((num.toString() != "?") && (isNaN(num) || num < 1 || num > 31))
              return 'Days must be between 1-31';
            break;
          case 'month':
            if (isNaN(num) || num < 1 || num > 12)
              return 'Months must be between 1-12';
            break;
          case 'dayOfWeek':
            if (num.toString() != "?") break;
            if (isNaN(num) || num < 0 || num > 6)
              return 'Days of week must be between 0-6';
            break;
        }
      }
    }
    
    return '';
  };

  const validateCron = (cronString: string) => {
    const parts = cronString.split(' ');
    if (parts.length !== 6) {
      return 'Invalid cron expression';
    }
    
    const errors = [
      validateCronPart(parts[0], 'minute'),
      validateCronPart(parts[1], 'hour'),
      validateCronPart(parts[2], 'dayOfMonth'),
      validateCronPart(parts[3], 'month'),
      validateCronPart(parts[4], 'dayOfWeek'),
      validateCronPart(parts[5], 'year'),
    ].filter(Boolean);

    if (parts[4] == "*" && parts[2] == "*") {
        errors.push("Can't use * for both day of week and day of month. Use ? for one of theminstead.");
    }
    
    return errors.length > 0 ? errors[0] : '';
  };

  const updateCron = (part: string, value: string) => {
    const newParts = { ...cronParts, [part]: value };
    const cronString = `${newParts.minute} ${newParts.hour} ${newParts.dayOfMonth} ${newParts.month} ${newParts.dayOfWeek} ${newParts.year}`;
    const error = validateCron(cronString);
    
    setCronParts(newParts);
    setError(error);
    onChange(cronString);
  };


  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="simple">Simple</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="simple" className="space-y-4">
          <Select
            value={`${cronParts.minute} ${cronParts.hour} ${cronParts.dayOfMonth} ${cronParts.month} ${cronParts.dayOfWeek} ${cronParts.year}`}
            onValueChange={(value) => {
              const parts = value.split(' ');
              setCronParts({
                minute: parts[0],
                hour: parts[1],
                dayOfMonth: parts[2],
                month: parts[3],
                dayOfWeek: parts[4],
                year: parts[5]
              });
              onChange(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select schedule" />
            </SelectTrigger>
            <SelectContent>
              {commonSchedules.map((schedule) => (
                <SelectItem key={schedule.value} value={schedule.value}>
                  {schedule.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="grid grid-cols-6 gap-2">
            <div>
              <label className="text-sm font-medium">Minute</label>
              <Input
                value={cronParts.minute}
                onChange={(e) => updateCron('minute', e.target.value)}
                placeholder="*"
                className="font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Hour</label>
              <Input
                value={cronParts.hour}
                onChange={(e) => updateCron('hour', e.target.value)}
                placeholder="*"
                className="font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Day of Month</label>
              <Input
                value={cronParts.dayOfMonth}
                onChange={(e) => updateCron('dayOfMonth', e.target.value)}
                placeholder="*"
                className="font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Month</label>
              <Input
                value={cronParts.month}
                onChange={(e) => updateCron('month', e.target.value)}
                placeholder="*"
                className="font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Day of Week</label>
              <Input
                value={cronParts.dayOfWeek}
                onChange={(e) => updateCron('dayOfWeek', e.target.value)}
                placeholder="?"
                className="font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Year</label>
              <Input
                value={cronParts.year}
                onChange={(e) => updateCron('year', e.target.value)}
                placeholder="*"
                className="font-mono"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="bg-gray-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <div>
              <div className="font-mono text-sm">
                {`${cronParts.minute} ${cronParts.hour} ${cronParts.dayOfMonth} ${cronParts.month} ${cronParts.dayOfWeek} ${cronParts.year}`}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};