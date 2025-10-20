import React, { useEffect } from 'react'
import { useResumeStore } from '../../stores'
import { Button } from '../ui/button'
import { RefreshCwIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select'
import { cn } from '@/utils'

export const HomeRoute: React.FC = () => {
  const {
    resumes,
    currentResume,
    loading,
    error,
    fetchResumes,
    setCurrentResume
  } = useResumeStore()

  useEffect(() => {
    fetchResumes()
  }, [fetchResumes])

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <header className='flex justify-between items-center mb-3'>
          <h3 className="text-sm font-semibold text-gray-900">Selected resume</h3>

          <Button
            variant="empty"
            size="icon"
            onClick={fetchResumes}
            disabled={loading}
          ><RefreshCwIcon /></Button>
        </header>

        {loading ? (
          <div className="text-xs text-gray-600">Loading resumes...</div>
        ) : resumes.length > 0 ? (
          <div className="space-y-2">
            {currentResume && (
              <Select>
                <SelectTrigger className="w-full h-auto bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded p-2 transition-colors" size='xl'>
                  <div>
                    <div className="text-xs font-medium text-blue-900">
                      <span>{currentResume.name}</span>
                      {currentResume.is_default && (
                        <span className="bg-green-100 text-green-800 px-1 py-px rounded text-xs">Default</span>
                      )}
                    </div>
                    <div className="text-xs text-blue-700">
                      Last updated: {new Date(currentResume.updated_at || currentResume.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </SelectTrigger>

                <SelectContent>
                  {resumes.map((resume) => (
                    <SelectItem
                      value={resume.id}
                      key={resume.id}
                      onSelect={() => setCurrentResume(resume)}
                      className={cn({ "bg-slate-50": resume.id === currentResume?.id })}
                    >
                      <div>
                        <div className="text-xs font-medium text-blue-900">
                          <span>{resume.name}</span>
                          {resume.is_default && (
                            <span className="bg-green-100 text-green-800 px-1 py-px rounded text-xs">Default</span>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ) : (
          <div className="text-xs text-gray-600">
            No resumes found. Create your first resume to get started.
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <Button
            variant="success"
            disabled={resumes.length === 0}
            className='w-full text-center'
          >
            Tailor Resume for this page
          </Button>
        </div>
      </div>
    </div>
  )
}
